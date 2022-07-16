const db = require("../models");
const maple = require('../utils/maple/maple.js');
const mapleData = require("../data/maple");


const MAPLEBOSSAPEARPERCENTAGE = 1 / 30;
// const MAPLEBOSSAPEARPERCENTAGE = 1;

const TIMELIMIT = 30 * 60 * 1000;



module.exports = async (client, message) => {
  var sequelize = require('../models/index').sequelize;
  sequelize.sync();
  if(Math.random() < MAPLEBOSSAPEARPERCENTAGE){
    try {

      var _rand = Math.random();
      var bossHp = 60000 + Math.floor(Math.pow(_rand, 2) * 400000);
      // bossHp = 2709 +  1; // test

      var specialBossAR = 0.3;
      // specialBossAR = 1; // test
      var bossType = (Math.random() < specialBossAR)? "special":"normal";
      var bossName = "엘리트 보스";

      var specialBossObject;
      var rewardRatio = 1;
      if(bossType == "special"){
        var bossNum = mapleData["boss"].length;
        var r = Math.floor(Math.random() * bossNum);
        specialBossObject = mapleData["boss"][r];
        bossHp *= specialBossObject.hp;
        bossHp = Math.floor(bossHp);
        rewardRatio = specialBossObject.hp;
        bossName = mapleData["boss"][r]["name"]
      }
      console.log(specialBossObject);

      var boss = {
        players: [],
        name: bossName,
        isDead: false,
        bossMaxHp: bossHp,
        bossHp: bossHp,
        playerATT: 500,
        canhit: false,
        bossType: bossType,
        rewardRatio: rewardRatio,
        specialBossObject: specialBossObject,
        reward: {
          redCube: Math.floor((5 + Math.floor(_rand*10)) * rewardRatio),
          eternalFlame: Math.floor((5 + Math.floor(_rand*10)) * rewardRatio),
          special: [],
        },
        rewardText: function(){
          var text = "확정 보상 (첫타, 딜 1등은 보상 두배) : \n";
          if(this.reward.redCube > 0){
            text += "---" + maple.emoji_redcube + "레드 큐브: " + this.reward.redCube + "개\n";
          }
          if(this.reward.eternalFlame > 0){
            text += "---" + maple.emoji_eternalrebirthflame + "영원한 환생의 불꽃: " + this.reward.eternalFlame + "개\n";
          }
          text += "확률 보상 : \n";
          if(this.bossType == "special"){
            for(var i = 0; i < this.specialBossObject.reward.length; i++){
              var itemType = this.specialBossObject.reward[i];
              var item = maple.getBossRewardItem(itemType)

              text += "---" + maple.equipmentString[item.type] + ":" + item.name + "\n";
            }
          }
          return text;
        },
        playerRewardText: function(p){
          var text = "";
          if(this.reward.redCube > 0){
            text += maple.emoji_redcube + "레드 큐브: " + p.reward.redCube + "개";
          }
          if(this.reward.eternalFlame > 0){
            text += maple.emoji_eternalrebirthflame + ",영원한 환생의 불꽃: " + p.reward.eternalFlame + "개 ";
          }
          console.log(p.reward);
          if(p.reward.special.length != 0){
            for(var i = 0; i < p.reward.special.length; i++){
              var item = p.reward.special[i];
              if(item.duplicated)continue;
              text += ", " + maple.equipmentString[item.type] + ":" + item.name;
            }

          }
          return text;
        },
        playerDamageText: function(p){
          var text = "";
          text += p.username + ": " + p.damage + "("+ (p.damage / this.bossMaxHp * 100).toFixed(2)+"%)";

          return text;
        },
        playerSort: function(){
          this.players.sort(function(a, b) {
            if(b.damage == a.damage){
              if(Math.random() < 0.5)
                return 1;
              else
                return -1;
            }
            return b.damage - a.damage;
          });
        },
        bossAppearMessageText: function(){
          var text = "--------------------------\n";
          this.playerSort();
          var _this = this;

          if(this.isDead){
            text += _this.name + "(이)가 처치되었습니다.\n\n" + "체력: " + this.bossHp + " / " + this.bossMaxHp + "\n" ;
            text += this.rewardText();
            text += "\n";


            text +=  "참가자 " + this.players.length + "명\n";

            this.players.forEach((p, i) => {
              text += "["+(i + 1)+"] " + _this.playerDamageText(p)+  "\n";
            });

            text +=  "\n보상 \n";

            this.players.forEach((p, i) => {
              var str = "" + ((p.firstAttack == true)?":one:":"") + ((i == 0)?":first_place:":"") + ((p.critical == true)?":boom:":"") + ((p.spoon == true)?"🥄":"");
              text += "["+(i + 1)+"] " + str + p.username + ": " + _this.playerRewardText(p) + "\n";
            });

          }else{
            text += _this.name + "(이)가 등장하였습니다.\n\n" + "체력: " + this.bossHp + " / " + this.bossMaxHp + "\n" ;
            text += this.rewardText();
            text += "\n";

            text +=  "참가자 " + this.players.length + "명\n";

            this.players.forEach((p, i) => {
              text += "["+(i + 1)+"] " + _this.playerDamageText(p)+  "\n";
            });

          }
          text += "\n--------------------------\n";






          return text;
        },
        attack: async function(playerATT){
          var damage = (this.bossHp >= playerATT)?playerATT:this.bossHp;
          this.bossHp -= damage;
          if(this.bossHp == 0){
            this.isDead = true;
            await this.onDead();
          }

          return damage;
        },
        onDead: async function(){
          this.playerSort();
          var _this = this;

          var topDealer = this.players[0];
          for await (const p of this.players){
            var reward = {
              redCube: _this.reward.redCube,
              eternalFlame: _this.reward.eternalFlame,
            };
            if(p == topDealer || p.firstAttack){
              reward.redCube *= 2;
              reward.eternalFlame *= 2;
            }
            p.reward = {};
            p.reward.redCube = reward.redCube;
            p.reward.eternalFlame = reward.eternalFlame;
            p.reward.special = [];
            for await (const itemType of _this.specialBossObject.reward){
              var item = maple.getBossRewardItem(itemType)
              var mitem = await db.MEquipmentItem.findOne({
                where:{
                  MUserId: p.id,
                  type: item.type,
                },
              });

              if(!mitem && Math.random() < item.drop){
                p.reward.special.push(item);
              }
            }

            var muser = await db.MUser.findOne({
              where: {
                id: p.id
              }
            });
            muser.redcube += p.reward.redCube;
            muser.eternalflame += p.reward.eternalFlame;
            for await(const item of p.reward.special) {
              var mitem = await db.MEquipmentItem.findOne({
                where:{
                  MUserId: p.id,
                  type: item.type,
                },
              });

              if(mitem){
                // item.duplicated = true;
                return;
              }
              var ao = maple.setAdditionalOption(item.type);
              var po = maple.setPotentialOption(item.type, "rare");
              mitem = await db.MEquipmentItem.create({
                MUserId: p.id,
                type: item.type,
                level: item["level"],
                rarity: item.randomPotentialOption?po[0]:0,
                additionalstr: item.additionalOption?ao["str"]:0,
                additionaldex: item.additionalOption?ao["dex"]:0,
                additionalint: item.additionalOption?ao["int"]:0,
                additionalluk: item.additionalOption?ao["luk"]:0,
                additionalstrdex: item.additionalOption?ao["strdex"]:0,
                additionalstrint: item.additionalOption?ao["strint"]:0,
                additionalstrluk: item.additionalOption?ao["strluk"]:0,
                additionaldexint: item.additionalOption?ao["dexint"]:0,
                additionaldexluk: item.additionalOption?ao["dexluk"]:0,
                additionalintluk: item.additionalOption?ao["intluk"]:0,
                additionalatk: item.additionalOption?ao["atk"]:0,
                additionalmatk: item.additionalOption?ao["matk"]:0,
                additionalbossdmg: item.additionalOption?ao["bossdmg"]:0,
                additionaldmg: item.additionalOption?ao["dmg"]:0,
                additionalallp: item.additionalOption?ao["allp"]:0,
                potential1: item.randomPotentialOption?po[1][0]:0,
                potential2: item.randomPotentialOption?po[1][1]:0,
                potential3: item.randomPotentialOption?po[1][2]:0,
              });
            }

            await muser.save();
          }

        }
      };





      var segcjannel = client.channels.cache.get('970733359053541396');
      if(!segcjannel){
        segcjannel = client.channels.cache.get('968815702280650752');
      }
      var bossApearMessage = await segcjannel.send(boss.bossAppearMessageText());
      await Promise.all([
        bossApearMessage.react('🥄'),
      ]);
      setTimeout(async function(){
        await Promise.all([
          bossApearMessage.react('🏹')
        ]);
        boss.canhit = true;
      }, 10000)

      const bossAttackFilter = (reaction, user) => {
        return  ['🏹', '🥄'].includes(reaction.emoji.name) && user.id !== client.user.id;
      };
      var startTime = new Date();
      while(!boss.isDead && (new Date() - startTime <  TIMELIMIT)){

        try {
          await bossApearMessage.awaitReactions(bossAttackFilter, { max: 1, time: 60000, errors: ['time'] })
          .then(async function(data) {
            const reaction = data.first();
            if(boss.isDead)return;
            if (reaction.emoji.name == '🏹') {
              reaction.users.cache.each(async user => {
                if(!boss.players.find(e => e.id == user.id) && !user.bot && boss.canhit){
                  var muser = await db.MUser.findOne({
                    where: {
                      id: user.id,
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
                  var _user = {id: user.id, username: user.username};

                  if(boss.players.length == 0){
                    _user.firstAttack = true;
                  }else{
                    _user.firstAttack = false;
                  }
                  boss.players.push(_user);

                  playerStat = maple.getPlayerStat(items, job);



                  var damage;
                  if(Math.random() * 100 < playerStat.crip){
                    damage = Math.floor(playerStat.statAtk * playerStat.penet / 100 * 2);
                    _user.damage = (damage > boss.bossHp)? boss.bossHp: damage ;
                    _user.critical = true;
                    await boss.attack(_user.damage);
                  }
                  else{
                    damage = Math.floor(playerStat.statAtk * playerStat.penet / 100);
                    _user.damage = (damage > boss.bossHp)? boss.bossHp:damage ;
                    _user.critical = false;

                    await boss.attack(_user.damage);
                  }


                  bossApearMessage.edit(boss.bossAppearMessageText());

                }
              });
            }else if(!boss.players.find(e => e.id == user.id) && reaction.emoji.name == "🥄"){
              reaction.users.cache.each(async user => {
                if(!boss.players.includes(user) && !user.bot){
                  var muser = await db.MUser.findOne({
                    where: {
                      id: user.id,
                    }
                  });
                  if(!muser){
                    segcjannel.send(user.username + " 유저가 존재하지 않습니다. !maple 가입 명령어를 통해 유저를 생성해주세요.");
                    return;
                  }


                  var _user = {id: user.id, username: user.username};

                  if(boss.players.length == 0){
                    _user.firstAttack = true;
                  }else{
                    _user.firstAttack = false;
                  }


                  boss.players.push(_user);
                  _user.spoon = true;


                  _user.damage = 100;
                  boss.attack(_user.damage);


                  bossApearMessage.edit(boss.bossAppearMessageText());

                }
              });
            }
          }).catch(async function(data) {
            // const reaction = data.first();
            // console.log(reaction);
            console.log(data);
          });

        } catch (e) {
          console.log(e)
        }
      }

      if(!boss.isDead){
        bossApearMessage.edit(boss.name +" 처치에 실패했습니다.");

        bossApearMessage.reactions.removeAll();
      }else{
        bossApearMessage.reactions.removeAll();
      }


    } catch (e) {
      console.log(e);
    } finally {

    }
  }else {
    // 보스 소환 안됨.
    return;
  }


};
