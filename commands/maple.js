const Discord = require('discord.js');

const db = require('../models');

const mapleData = require("../data/maple");

const maple = require('../utils/maple/maple.js');




exports.run = async (client, message, [action, args]) => {
  if(message.author.bot) return;
  var author = message.author;
  var channel = message.channel;
  if(!channel.name == "maplestory")return;

  if(action == "가입"){
    try{
      var user = await db.MUser.findOne({
        where: {
          id: author.id,
        }
      });
      var jobs = await db.MJob.findAll();

      // var [user, userCreated] = await db.MUser.findOrCreate({
      //   where: {
      //     id: author.id,
      //   },
      //   defaults: {
      //     id: author.id,
      //     username: author.username,
      //     level: 10,
      //     redcube: 20,
      //     eternalflame: 20,
      //   },
      // });
      if(user){
        channel.send("이미 가입되었습니다.")
      }else{
        var jobChoiceMessage = await channel.send("직업을 선택해주세요.\n1.전사 2.궁수 3.법사 4.도적 5.힘해적 6.덱해적");
        const jobChoiceFilter = (reaction, user) => {
          return ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','❌'].includes(reaction.emoji.name) && user.id == author.id;
        };
        await Promise.all([
          jobChoiceMessage.react('1️⃣'),
          jobChoiceMessage.react('2️⃣'),
          jobChoiceMessage.react('3️⃣'),
          jobChoiceMessage.react('4️⃣'),
          jobChoiceMessage.react('5️⃣'),
          jobChoiceMessage.react('6️⃣'),
          jobChoiceMessage.react('❌'),
        ]);
        var jobId = 0;
        var jobChoiceExitFlag = false;
        var startTime = new Date();
        while((jobId == 0 && !jobChoiceExitFlag) && (new Date() < touchTime.setMinutes( touchTime.getMinutes() + 1 ))){
          try {
            await jobChoiceMessage.awaitReactions(jobChoiceFilter, { max: 1, time: 60000, errors: ['time'] })
              .then(async function(data) {
                const reaction = data.first();
                if (reaction.emoji.name === '1️⃣') {
                  jobId = 0;
                }else if (reaction.emoji.name === '2️⃣') {
                  jobId = 1;
                }else if (reaction.emoji.name === '3️⃣') {
                  jobId = 2;
                }else if (reaction.emoji.name === '4️⃣') {
                  jobId = 3;
                }else if (reaction.emoji.name === '5️⃣') {
                  jobId = 4;
                }else if (reaction.emoji.name === '6️⃣') {
                  jobId = 5;
                }else if (reaction.emoji.name === '❌') {
                  stopFlag = true;
                }
              }).catch(async function(data) {
                console.log(data);
              });
          } catch (e) {
            console.log(e)
          }

        }

        if(jobChoiceExitFlag){
          jobChoiceMessage.delete();
          return;
        }

        user = await db.MUser.create({
          id: author.id,
          username: author.username,
          level: 10,
          redcube: 20,
          eternalflame: 20,
          MJobId: jobId,
        });
        items = []
        Object.keys(mapleData["item"]).forEach(async (itemType, i) => {
          var ao = maple.setAdditionalOption(itemType);
          var po = maple.setPotentialOption(itemType, "rare");

          if(!mapleData["item"][itemType]["default"]){   // 보스 드랍 아이템

          }else if(["emblem", "shoulder"].includes(item.type)){  // 추옵 없는 아이템
            var item = await db.MEquipmentItem.create({
              MUserId: author.id,
              type: itemType,
              level: mapleData["item"][itemType]["level"],
              rarity: po[0],
              additionalstr: 0,
              additionaldex: 0,
              additionalint: 0,
              additionalluk: 0,
              additionalstrdex: 0,
              additionalstrint: 0,
              additionalstrluk: 0,
              additionaldexint: 0,
              additionaldexluk: 0,
              additionalintluk: 0,
              additionalatk: 0,
              additionalmatk: 0,
              additionalbossdmg: 0,
              additionaldmg: 0,
              additionalallp: 0,
              potential1: po[1][0],
              potential2: po[1][1],
              potential3: po[1][2],
            });
          }else{    // 추옵 있는 아이템
            var item = await db.MEquipmentItem.create({
              MUserId: author.id,
              type: itemType,
              level: mapleData["item"][itemType]["level"],
              rarity: po[0],
              additionalstr: ao["str"],
              additionaldex: ao["dex"],
              additionalint: ao["int"],
              additionalluk: ao["luk"],
              additionalstrdex: ao["strdex"],
              additionalstrint: ao["strint"],
              additionalstrluk: ao["strluk"],
              additionaldexint: ao["dexint"],
              additionaldexluk: ao["dexluk"],
              additionalintluk: ao["intluk"],
              additionalatk: ao["atk"],
              additionalmatk: ao["matk"],
              additionalbossdmg: ao["bossdmg"],
              additionaldmg: ao["dmg"],
              additionalallp: ao["allp"],
              potential1: po[1][0],
              potential2: po[1][1],
              potential3: po[1][2],
            });
          }

          channel.send(maple.itemStatString(item))
          items.push(item);
        });

        if(user){
          jobChoiceMessage.edit("이름: " + user.username + " 직업: "+ jobs[user.MJobId].jobname + " 계정이 생성되었습니다.");
          jobChoiceMessage.reactions.removeAll();
        }else{
          jobChoiceMessage.edit("계정 생성에 실패했습니다.");
        }
      }

    }catch(error){
      console.log(error)
    }
  }else if(action == "내정보"){
    var muser = await db.MUser.findOne({
      where: {
        id: author.id,
      }
    });
    if(!muser){
      segcjannel.send(user.username + " 유저가 존재하지 않습니다. !maple 가입 명령어를 통해 유저를 생성해주세요.");
      return;
    }

    var job = await db.MJob.findOne({
      where: {
        id: muser.MJobId
      }
    });

    var items = await db.MEquipmentItem.findAll({
      where:{
        MUserId: muser.id
      }
    })
    message.reply(maple.getPlayerStatString(muser, items, job));

  }else if(action == "장비"){
    var muser = await db.MUser.findOne({
      where: {
        id: author.id,
      }
    });
    if(!muser){
      segcjannel.send(user.username + " 유저가 존재하지 않습니다. !maple 가입 명령어를 통해 유저를 생성해주세요.");
      return;
    }
    var job = await db.MJob.findOne({
      where: {
        id: muser.MJobId
      }
    });
    var item;
    var type;
    if(maple.equipmentStringReverse[args]){
      item = await db.MEquipmentItem.findOne({
        where:{
          MUserId: muser.id,
          type: maple.equipmentStringReverse[args]
        }
      });
      type = maple.equipmentStringReverse[args];

      if(!item){
        replyMessage = await message.channel.send("아직 획득하지 못한 장비입니다.");
        return;
      }

    }else {
      replyMessage = await message.channel.send("잘못된 장비명입니다.");
      return;
    }

    var items = await db.MEquipmentItem.findAll({
      where:{
        MUserId: muser.id,
        type: {
          [db.Sequelize.Op.ne]: type,
        }
      }
    });


    var beforePlayerStat = maple.getPlayerStat(items, job);
    items.push(item);
    var afterPlayerStat = maple.getPlayerStat(items, job);
    items.pop(item);
    var statAtkDefer = afterPlayerStat.statAtk - beforePlayerStat.statAtk;
    var itemStat = maple.itemStatString(item, job, statAtkDefer);
    itemStat += "\n";
    itemStat += maple.emoji_eternalrebirthflame + "영원한 환생의 불꽃 : " + muser.eternalflame + "개\n";
    itemStat += maple.emoji_redcube + "레드 큐브 : " + muser.redcube + "개\n";
    replyMessage = await message.channel.send(itemStat);




    var equipmentStatExitFlag = false;

    if(mapleData["item"][type]["additionalOption"]){
      await replyMessage.react(maple.emoji_eternalrebirthflame)
      await replyMessage.react(maple.emoji_blackrebirthflame)
    }
    if(mapleData["item"][type]["randomPotentialOption"]){
      await replyMessage.react(maple.emoji_redcube)
      await replyMessage.react(maple.emoji_blackcube)
    }
    await replyMessage.react('❌');


    const equipmentStatFilter = (reaction, user) => {
      return  ["redcube", "eternalrebirthflame", "blackcube", "blackrebirthflame", '❌'].includes(reaction.emoji.name) && user.id == author.id;
      // return true;
    };

    var touchTime = new Date();

    while(!equipmentStatExitFlag && (new Date() < touchTime.setMinutes( touchTime.getMinutes() + 3 ))){

      var beforePlayerStat = maple.getPlayerStat(items, job);

      items.push(item);
      var afterPlayerStat = maple.getPlayerStat(items, job);
      items.pop(item);
      var statAtkDefer = afterPlayerStat.statAtk - beforePlayerStat.statAtk;
      var itemStat = maple.itemStatString(item, job, statAtkDefer);
      itemStat += maple.emoji_eternalrebirthflame + "영원한 환생의 불꽃 : " + muser.eternalflame + "개\n";
      itemStat += maple.emoji_redcube + "레드 큐브 : " + muser.redcube + "개\n";
      replyMessage.edit(itemStat);



      try {
        await replyMessage.awaitReactions(equipmentStatFilter, { max: 1, time: 60000, errors: ['time'] })
          .then(async function(data) {
            const reaction = data.first();
            if (reaction.emoji.name == "eternalrebirthflame" && mapleData["item"][type]["additionalOption"]) {
              touchTime = new Date();
              if(muser.eternalflame == 0){
                replyMessage.edit(itemStat + "\n영원한 환생의 불꽃이 부족합니다.\n");
                return;
              }
              var ao = maple.setAdditionalOption(item.type);
              item.additionalstr = ao["str"];
              item.additionaldex = ao["dex"];
              item.additionalint = ao["int"];
              item.additionalluk = ao["luk"];
              item.additionalstrdex = ao["strdex"];
              item.additionalstrint = ao["strint"];
              item.additionalstrluk = ao["strluk"];
              item.additionaldexint = ao["dexint"];
              item.additionaldexluk = ao["dexluk"];
              item.additionalintluk = ao["intluk"];
              item.additionalatk = ao["atk"];
              item.additionalmatk = ao["matk"];
              item.additionalbossdmg = ao["bossdmg"];
              item.additionaldmg = ao["dmg"];
              item.additionalallp = ao["allp"];
              await item.save();
              muser.eternalflame -= 1;
              await muser.save();
              await replyMessage.reactions.resolve(reaction).users.remove(author.id);

            }
            else if (reaction.emoji.name == "redcube" && mapleData["item"][type]["randomPotentialOption"]){
              touchTime = new Date();
              if(muser.redcube == 0){
                replyMessage.edit(itemStat + "\n레드 큐브가 부족합니다.\n");
                return;
              }
              var po = maple.setPotentialOption(item.type, item.rarity);
              item.rarity = po[0];
              item.potential1 = po[1][0];
              item.potential2 = po[1][1];
              item.potential3 = po[1][2];
              await item.save();
              muser.redcube -= 1;
              await muser.save();
              await replyMessage.reactions.resolve(reaction).users.remove(author.id);
            }
            else if (reaction.emoji.name == "blackrebirthflame" && mapleData["item"][type]["additionalOption"]){
              touchTime = new Date();
              if(muser.eternalflame < 100){
                replyMessage.edit(itemStat + "\n영원한 환생의 불꽃 100개가 필요합니다.\n");
                return;
              }
              var resultItem = maple.setServeralAdditionalOption(items, item, job, 100);
              item.additionalstr = resultItem.additionalstr
              item.additionaldex = resultItem.additionaldex
              item.additionalint = resultItem.additionalint
              item.additionalluk = resultItem.additionalluk
              item.additionalstrdex = resultItem.additionalstrdex
              item.additionalstrint = resultItem.additionalstrint
              item.additionalstrluk = resultItem.additionalstrluk
              item.additionaldexint = resultItem.additionaldexint
              item.additionaldexluk = resultItem.additionaldexluk
              item.additionalintluk = resultItem.additionalintluk
              item.additionalatk = resultItem.additionalatk
              item.additionalmatk = resultItem.additionalmatk
              item.additionalbossdmg = resultItem.additionalbossdmg
              item.additionaldmg = resultItem.additionaldmg
              item.additionalallp = resultItem.additionalallp
              await item.save();
              muser.eternalflame -= 100;
              await muser.save();

              await replyMessage.reactions.resolve(reaction).users.remove(author.id);
            }
            else if (reaction.emoji.name == "blackcube" && mapleData["item"][type]["randomPotentialOption"]){
              touchTime = new Date();
              if(muser.redcube < 100){
                replyMessage.edit(itemStat + "\n레드 큐브 100개가 필요합니다.\n");
                return;
              }
              var resultItem = maple.setServeralPotentialOption(items, item, job, 100);
              item.rarity = resultItem.rarity
              item.potential1 = resultItem.potential1
              item.potential2 = resultItem.potential2
              item.potential3 = resultItem.potential3
              await item.save();
              muser.redcube -= 100;
              await muser.save();

              await replyMessage.reactions.resolve(reaction).users.remove(author.id);
            }
            else if (reaction.emoji.name == '❌'){
              equipmentStatExitFlag = true;
            }
          })
        } catch (e) {
          console.log(e)
        }


    }

    replyMessage.reactions.removeAll();


  }else if(action == "교환"){
    var _type = message.content.split(' ')[2];
    var _num = message.content.split(' ')[3];
    switch (_type) {
      case "환불":
        muser = await db.MUser.findOne({
          where: {
            id: author.id,
          }
        });

        if(muser.redcube >= _num * 2){
          muser.eternalflame += _num * 1;
          muser.redcube -= _num * 2;
          await muser.save();

          message.reply("레드큐브 " + _num * 2 + "개를 영원한 환생의 불꽃 " + _num +"개로 교환하였습니다.");

        }
        else{
          message.reply("레드 큐브의 개수가 부족합니다. ("+muser.redcube+"/"+(_num * 2)+ ")");

        }

        break;
      case "큐브":
      muser = await db.MUser.findOne({
        where: {
          id: author.id,
        }
      });

      if(muser.eternalflame >= _num * 2){
        muser.redcube += _num * 1;
        muser.eternalflame -= _num * 2;
        await muser.save();
        message.reply("영원한 환생의 불꽃 " + _num * 2 + "개를 레드 큐브 " + _num +"개로 교환하였습니다.");

      }
      else{
        message.reply("영원한 환생의 불꽃의 개수가 부족합니다. ("+muser.eternalflame+"/"+(_num * 2)+ ")");

      }

      break;
    }
  }else if(action == "리더보드"){
    var musers = await db.MUser.findAll();
    var playerStats = [];

    for(var i = 0; i < musers.length; i++){
      var muser = musers[i];
      var job = await db.MJob.findOne({
        where: {
          id: muser.MJobId
        }
      });
      var items = await db.MEquipmentItem.findAll({
        where:{
          MUserId: muser.id
        }
      });
      var playerStat = maple.getPlayerStat(items, job);
      var _ps = {username:muser.username, damage:Math.floor(playerStat.statAtk * playerStat.penet / 100 * 2)};
      playerStats.push(_ps);
    }

    const _rankEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('예상 데미지 리더보드 (방어율 100% 기준)');
    for(var i = 0; i < playerStats.length; i++){
      _rankEmbed.addField(`${i+1}등: ${playerStats[i].username}`, `예상 데미지: ${playerStats[i].damage}`);
    }
    message.reply(_rankEmbed);

  }else if(action == "test"){
    var testData = require("../data/maple");
    console.log(testData);

  }


};
