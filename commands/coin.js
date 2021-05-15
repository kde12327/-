const Discord = require('discord.js');

const db = require('../models');

const COINMAX = 3.1;
const COINMIN = -3;

exports.run = async (client, message, [action, volume]) => {
  if(message.channel.name === "seg-코인") return;

  var author = message.author;
  try{
    var [user, userCreated] = await db.User.findOrCreate({
      where: {
        id: author.id,
      },
      defaults: {
        id: author.id,
        username: author.username,
        balance: 1000,
        coin: 0.0,
        average: 0.0,
      },
    });
    var [coin, coinCreated] = await db.Coin.findOrCreate({
      where: {
        id: 1
      },
      defaults: {
        price: '100',
      },
    });
    user.username = author.username;
    await user.save();

    if(!action){
      message.channel.send("'!coin help' 혹은 '!coin 도움' 을 입력하면 도움말을 볼 수 있습니다.");
    }else if (action === '도움' || action === 'help') {
      const exampleEmbed = new Discord.MessageEmbed()
      	.setColor('#0099ff')
        .setTitle('도움말')
      	.addFields(
      		{ name: '!coin 내정보', value: '자신의 정보가 표시됩니다.', inline: true},
      		{ name: '\u200B', value: '\u200B' },
      		{ name: '!coin 현재가격', value: '코인의 현재 가격이 표시됩니다.', inline: true },
          { name: '\u200B', value: '\u200B' },
      		{ name: '!coin 매수 [숫자|(0~100)%]', value: '코인을 [숫자|(0~100)%]개 만큼 매수합니다.', inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: '!coin 매도 [숫자|(0~100)%]', value: '코인을 [숫자|(0~100)%]개 만큼 매도합니다.', inline: true },
      	)
      message.reply(exampleEmbed);
    }else if (action === '현재가격') {
      message.channel.send("현재 SEG코인의 가격은 " +  coin.price +  "원 입니다.");
		} else if (action === '내정보') {
      const exampleEmbed = new Discord.MessageEmbed()
      	.setColor('#0099ff')
      	.setTitle('내 정보')
      	.setURL(message.author.displayAvatarURL())
      	.setAuthor(author.username, message.author.displayAvatarURL())
      	.setDescription(message.author, '님의 SEG 코인 계좌 정보 입니다.')
      	// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
      	.addFields(
      		{ name: '총 평가', value: parseFloat(user.balance + user.coin * coin.price).toFixed(2) + ' 원' },
      		{ name: '\u200B', value: '\u200B' },
      		{ name: '잔고', value: parseFloat(user.balance).toFixed(2) + ' 원', inline: true },
      		{ name: '코인 수', value: user.coin + ' 개', inline: true },
      		{ name: '수익(ROE)', value: ((coin.price - user.average) * user.coin).toFixed(2) + ' 원 ('+ parseFloat(((coin.price - user.average) * user.coin).toFixed(2)/(user.average * user.coin) * 100).toFixed(2) +'%)', inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: '평균 단가', value: parseFloat(user.average).toFixed(2) + ' 개', inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: '매수가능', value: parseFloat(user.balance / coin.price).toFixed(2) + ' 개', inline: true },
          { name: '매도가능', value: user.coin + ' 개', inline: true },

      	)
      message.reply(exampleEmbed);
		} else if (action === '매수') {
      var num = parseFloat(volume);

      if(!volume){
        message.reply("잘못된 입력입니다. 명령어: !coin 매수 [숫자|(0~100)%]");
      }
      else if(volume.toString().endsWith('%')){
        var percent = parseFloat(volume.toString().split('%')[0]);
        if(percent > 100 || percent < 0){
          message.reply("잘못된 입력입니다. 명령어: !coin 매수 [숫자|(0~100)%]");
        }else if(user.balance === 0){
          message.reply("계좌에 잔고가 없습니다. 현재 잔고는 " + user.balance + "원 입니다.");
        }else{
          var num =  user.balance * (percent / 100) / coin.price;
          user.balance = parseFloat(user.balance - (coin.price * num));
          user.average = (user.average * user.coin + coin.price * num) / (user.coin + num)
          user.coin = user.coin + num;


          await user.save();
          message.reply("매수가 체결되었습니다. 현재 소지한 코인 수는 "+ user.coin+" 개 입니다." );
        }
      }else if(!parseFloat(volume)){
        message.reply("잘못된 입력입니다. 명령어: !coin 매수 [숫자|(0~100)%]");

      }else if(user.balance - (coin.price * num)<0){
        message.reply("잔고가 부족합니다. 현재 매수 가능 코인 수는 "+ parseFloat(user.balance / coin.price).toFixed(2) + " 개 입니다." );

      }else{
        user.balance = parseFloat(user.balance - (coin.price * num));
        user.average = (user.average * user.coin + coin.price * num) / (user.coin + num)
        user.coin = user.coin + num;


        await user.save();
        message.reply("매수가 체결되었습니다. 현재 소지한 코인 수는 "+ user.coin+" 개 입니다." );
      }

			// [zeta]
		} else if (action === '매도') {
      var num = parseFloat(volume);
      if(!volume){
        message.reply("잘못된 입력입니다. 명령어: !coin 매도 [숫자|(0~100)%]");

      }
      else if(volume.toString().endsWith('%')){
        console.log(1)
        var percent = parseFloat(volume.toString().split('%')[0]);
        if(percent > 100 || percent < 0){
          message.reply("잘못된 입력입니다. 명령어: !coin 매도 [숫자|(0~100)%]");
        }else if(user.coin === 0){
          message.reply("계좌에 코인이 없습니다. 현재 소지한 코인 수는 " + user.balance + " 개 입니다.");
        }else{
          var num =  user.coin * (percent / 100);
          user.balance = parseFloat(user.balance + (coin.price * num));
          user.coin = user.coin - num;
          console.log(num)

          await user.save();
          message.reply("매도가 체결되었습니다. 현재 소지한 코인 수는 "+ user.coin+" 개 입니다." );
        }
      }else if(!parseFloat(volume)){
        message.reply("잘못된 입력입니다. 명령어: !coin 매도 [숫자|(0~100)%]");


      }else if(user.coin - num < 0){
        message.reply("잔고가 부족합니다. 현재 매도 가능 코인 수는 "+ user.coin + " 개 입니다." );

      }else{
        user.balance = parseFloat(user.balance + (coin.price * num));
        user.coin = user.coin - num;
        await user.save();
        message.reply("매도가 체결되었습니다. 현재 소지한 코인 수는 "+ user.coin + " 개 입니다." );
      }


		}else if (action === '리더보드') {
      var users = await db.User.findAll();
      var fields = [];

      users.sort(function(a, b){
        return parseFloat(b.balance + b.coin * coin.price).toFixed(2) - parseFloat(a.balance + a.coin * coin.price).toFixed(2);
      });

      users.forEach((_user, i) => {
        fields.push({ name: (i + 1) + '등', value: _user.username + ' ' + parseFloat(_user.balance + _user.coin * coin.price).toFixed(2) + ' 원' , inline: true });
        fields.push({ name: '\u200B', value: '\u200B' });
      });




      const exampleEmbed = new Discord.MessageEmbed()
      	.setColor('#ffffff')
      	.setTitle('리더보드')
      	.setDescription('계좌 총 평가 현황입니다.')
      	.addFields(fields);
      message.channel.send(exampleEmbed);
		}
    // else if (action === 'removetag') {
		// 	// [mu]
		// }
  } catch (e) {
    console.log(e);
  } finally {

  }


};
