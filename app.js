const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json");
const Sequelize = require('sequelize');

const COINMAX = 3.1;
const COINMIN = -3;
const COININTERVAL = 60000;
const COINPREFIX = '!';

// connect sqlite
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'sqlitedb',
});

const Coin = sequelize.define('coin', {
	price: {
		type: Sequelize.FLOAT,
		unique: true,
	},
});

const User = sequelize.define('user', {
  id:{
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
  },
	username: {
		type: Sequelize.STRING,
	},
  balance: {
    type: Sequelize.FLOAT,
  },
  coin: {
    type: Sequelize.FLOAT,
  },
  average: {
    type: Sequelize.FLOAT,
  }
});

client.on('ready', async function () {
  console.log(`Logged in as ${client.user.tag}!`);
  Coin.sync();
  User.sync();

  let timerId = setInterval(async () => {
    try {
      var [coin, created] = await Coin.findOrCreate({
        where: {
          id: 1
        },
        defaults: {
          price: '100',
        },
      })
      var next = parseFloat(coin.price + coin.price * (Math.random() * (COINMAX - COINMIN) + COINMIN) / 100).toFixed(2);
      coin.price = (next > 0) ? next: 0;
      console.log('SEG coin price['+ new Date() +']: '+coin.price);
      await coin.save();
    } catch (e) {
      console.log(e);
    } finally {

    }
  }, COININTERVAL);




});

function endsWithStr(msg, str, content){
  if(msg.content.endsWith(str)){
    msg.channel.send(content);
  }
}
function startsWithdStr(msg, str, content){
  if(msg.content.startsWith(str)){
    msg.channel.send(content);
  }
}
function includesStr(msg, str, content){
  if(msg.content.includes(str)){
    msg.channel.send(content);
  }
}

client.on('message', async (msg) => {
  if(msg.author.bot) return;

  if (msg.channel.name === 'seg-코인' && msg.content.startsWith(COINPREFIX)) {
    var author = msg.author;
    try{
      var [user, userCreated] = await User.findOrCreate({
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
      var [coin, coinCreated] = await Coin.findOrCreate({
        where: {
          id: 1
        },
        defaults: {
          price: '100',
        },
      });
      user.username = author.username;
      await user.save();



      const input = msg.content.slice(COINPREFIX.length).trim().split(' ');
  		const command = input.shift();
  		const commandArgs = input.join(' ');
      if (command === '도움') {
        const exampleEmbed = new Discord.MessageEmbed()
        	.setColor('#0099ff')
          .setTitle('도움말')
        	.addFields(
        		{ name: '!내정보', value: '자신의 정보가 표시됩니다.', inline: true},
        		{ name: '\u200B', value: '\u200B' },
        		{ name: '!코인', value: '코인의 현재 가격이 표시됩니다.', inline: true },
            { name: '\u200B', value: '\u200B' },
        		{ name: '!매수 [숫자|(0~100)%]', value: '코인을 [숫자|(0~100)%]개 만큼 매수합니다.', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: '!매도 [숫자|(0~100)%]', value: '코인을 [숫자|(0~100)%]개 만큼 매도합니다.', inline: true },
        	)
        msg.reply(exampleEmbed);
      }else if (command === '코인') {
        msg.channel.send("현재 SEG코인의 가격은 " +  coin.price +  "원 입니다.");

  		} else if (command === '내정보') {
        const exampleEmbed = new Discord.MessageEmbed()
        	.setColor('#0099ff')
        	.setTitle('내 정보')
        	.setURL(msg.author.displayAvatarURL())
        	.setAuthor(author.username, msg.author.displayAvatarURL())
        	.setDescription(msg.author, '님의 SEG 코인 계좌 정보 입니다.')
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
        msg.reply(exampleEmbed);
  		} else if (command === '매수') {
        var num = parseFloat(input);

        if(input.length !== 1){
          msg.reply("잘못된 입력입니다. 명령어: !매수 [숫자|(0~100)%]");
        }
        else if(input.toString().endsWith('%')){
          var percent = parseFloat(input.toString().split('%')[0]);
          if(percent > 100 || percent < 0){
            msg.reply("잘못된 입력입니다. 명령어: !매수 [숫자|(0~100)%]");
          }else if(user.balance === 0){
            msg.reply("계좌에 잔고가 없습니다. 현재 잔고는 " + user.balance + "원 입니다.");
          }else{
            var num =  user.balance * (percent / 100) / coin.price;
            user.balance = parseFloat(user.balance - (coin.price * num));
            user.average = (user.average * user.coin + coin.price * num) / (user.coin + num)
            user.coin = user.coin + num;


            await user.save();
            msg.reply("매수가 체결되었습니다. 현재 소지한 코인 수는 "+ user.coin+" 개 입니다." );
          }
        }else if(!parseFloat(input)){
          msg.reply("잘못된 입력입니다. 명령어: !매수 [숫자|(0~100)%]");

        }else if(user.balance - (coin.price * num)<0){
          msg.reply("잔고가 부족합니다. 현재 매수 가능 코인 수는 "+ parseFloat(user.balance / coin.price).toFixed(2) + " 개 입니다." );

        }else{
          user.balance = parseFloat(user.balance - (coin.price * num));
          user.average = (user.average * user.coin + coin.price * num) / (user.coin + num)
          user.coin = user.coin + num;


          await user.save();
          msg.reply("매수가 체결되었습니다. 현재 소지한 코인 수는 "+ user.coin+" 개 입니다." );
        }

  			// [zeta]
  		} else if (command === '매도') {
        var num = parseFloat(input);
        if(input.length !== 1){
          msg.reply("잘못된 입력입니다. 명령어: !매도 [숫자|(0~100)%]");

        }
        else if(input.toString().endsWith('%')){
          var percent = parseFloat(input.toString().split('%')[0]);
          if(percent > 100 || percent < 0){
            msg.reply("잘못된 입력입니다. 명령어: !매도 [숫자|(0~100)%]");
          }else if(user.coin === 0){
            msg.reply("계좌에 코인이 없습니다. 현재 소지한 코인 수는 " + user.balance + " 개 입니다.");
          }else{
            var num =  user.coin * (percent / 100) / coin.price;
            user.balance = parseFloat(user.balance + (coin.price * num));
            user.coin = user.coin - num;


            await user.save();
            msg.reply("매도가 체결되었습니다. 현재 소지한 코인 수는 "+ user.coin+" 개 입니다." );
          }
        }else if(!parseFloat(input)){
          msg.reply("잘못된 입력입니다. 명령어: !매도 [숫자|(0~100)%]");


        }else if(user.coin - num < 0){
          msg.reply("잔고가 부족합니다. 현재 매도 가능 코인 수는 "+ user.coin + " 개 입니다." );

        }else{
          user.balance = parseFloat(user.balance + (coin.price * num));
          user.coin = user.coin - num;
          await user.save();
          msg.reply("매도가 체결되었습니다. 현재 소지한 코인 수는 "+ user.coin + " 개 입니다." );
        }


  		}else if (command === '리더보드') {
        var users = await User.findAll();
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
        msg.channel.send(exampleEmbed);
  		}
      // else if (command === 'removetag') {
  		// 	// [mu]
  		// }
    } catch (e) {
      console.log(e);
    } finally {

    }


	}



  switch ( msg.content ) {
    case '도움!':
      msg.reply(`
        송수는?/ 학인이는?/ 꿀벌 입장~/ 꼴벌 입장~/ ???/ 따봉/ 떴다!/ 학집비?/ - 뭐임?/ - 못참지/ - 못 참지/ - ㄱ?/ - 기?/ -학집처-
        `);
      break;
    case '송수는?':
      msg.channel.send('바보다!');
      msg.channel.send('<:24:757596444948693072>');
      break;
    case '학인이는?':
      msg.channel.send('티니아가 없다!');
      msg.channel.send('<:not_hak:829933350809894915>');
      msg.channel.send('<:24:757596444948693072>');
      break;
    case '꿀벌 입장~':
      msg.channel.send('<:24:757596444948693072>');
      msg.channel.send('<:24:757596444948693072> <:24:757596444948693072>');
      msg.channel.send('<:24:757596444948693072> <:24:757596444948693072> <:24:757596444948693072>');
      break;
    case '꼴벌 입장~':
      msg.channel.send('<:22:757596543846056068>');
      msg.channel.send('<:22:757596543846056068> <:22:757596543846056068>');
      msg.channel.send('<:22:757596543846056068> <:22:757596543846056068> <:22:757596543846056068>');
      break;
    case '???':
      msg.channel.send('<:hakinban:825624343316922401><:hakinban:825624343316922401><:hakinban:825624343316922401>');
      break;
    case '따봉':
      msg.channel.send('<:92:793980116081442856>');
      msg.channel.send('<:19:757596967005061120>');
      msg.channel.send('<:18:757596955143700520>');
      msg.channel.send('<:20:757596978673877155>');
      msg.channel.send('<:36:759268501910192129>');
      break;
    case '떴다!':
      msg.react('<:92:793980116081442856>');
      msg.react('<:19:757596967005061120>');
      msg.react('<:18:757596955143700520>');
      msg.react('<:20:757596978673877155>');
      msg.react('<:36:759268501910192129>');
      break;
    case '학집비?':
      msg.channel.send('네~ 비었습니다~');
      break;
    case '프로필보기' :
      msg.reply(msg.author.displayAvatarURL());
      break;
    case '테이블호출' :
      const table = new Discord.MessageEmbed().setTitle("도움창제목이빈다").setColor('#A9A9F5').setDescription("도움창내용입니다");
      msg.channel.send(table);
      break;
    default: ;

  }
  endsWithStr(msg, '뭐임?', '네~ 알려드렸읍니다~');
  endsWithStr(msg, '못참지', 'ㄹㅇㅋㅋ');
  endsWithStr(msg, '못 참지', 'ㄹㅇㅋㅋ');
  endsWithStr(msg, 'ㄱ?', 'ㄱㄱ');
  endsWithStr(msg, '기?', 'ㄱㄱ');
  includesStr(msg, '학집처', '드가자~ 드가자~');


  if(msg.content.startsWith('질문:'))
  {
    let str = msg.content.split('질문: ')[1];
    let choice = str.split('?');
    msg.reply(choice[Math.floor(Math.random() * (choice.length - 1 - 0) + 0)].trim());
  }
});

client.login(token.token);
