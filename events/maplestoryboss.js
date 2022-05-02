const db = require("../models");
const maple = require('../commands/maple.js')


const MAPLEBOSSAPEARPERCENTAGE = 1 / 30;
// const MAPLEBOSSAPEARPERCENTAGE = 1;

const TIMELIMIT = 30 * 60 * 1000;

module.exports = async (client, message) => {
  var sequelize = require('../models/index').sequelize;
  sequelize.sync();
  if(Math.random() < MAPLEBOSSAPEARPERCENTAGE){
    try {

      var _rand = Math.random();
      bossHp = 4000 + Math.floor(Math.pow(_rand, 5) * 100000);



      var boss = {
        players: [],
        isDead: false,
        bossMaxHp: bossHp,
        bossHp: bossHp,
        playerATT: 500,
        reward: {
          redCube: 5 + Math.floor(_rand*10),
          eternalFlame: 5 + Math.floor(_rand*10),
        },
        rewardText: function(){
          var text = "개인 보상 (첫타, 딜 1등은 보상 두배) : \n";
          if(this.reward.redCube > 0){
            text += "---레드 큐브: " + this.reward.redCube + "개\n";
          }
          if(this.reward.eternalFlame > 0){
            text += "---영원한 환생의 불꽃: " + this.reward.eternalFlame + "개\n";
          }
          return text;
        },
        playerRewardText: function(p){
          console.log(p)
          var text = "";
          if(this.reward.redCube > 0){
            text += "레드 큐브: " + p.reward.redCube + "개 ";
          }
          if(this.reward.eternalFlame > 0){
            text += "영원한 환생의 불꽃: " + p.reward.eternalFlame + "개 ";
          }
          return text;
        },
        playerDamageText: function(p){
          var text = "";
          text += p.username + ": " + p.damage + "("+ (p.damage / this.bossMaxHp * 100)+"%)";

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
          var text = "";
          this.playerSort();
          var _this = this;

          if(this.isDead){
            text += "엘리트 보스가 처치되었습니다.\n\n" + "체력: " + this.bossHp + " / " + this.bossMaxHp + "\n" ;
            text += this.rewardText();
            text += "\n";


            text +=  "참가자 " + this.players.length + "명\n";

            this.players.forEach((p, i) => {
              text += "["+(i + 1)+"] " + _this.playerDamageText(p)+  "\n";
            });

            text +=  "\n보상 \n";

            this.players.forEach((p, i) => {
              text += "["+(i + 1)+"] " + p.username + ": " + _this.playerRewardText(p) + "\n";
            });

          }else{
            text += "엘리트 보스가 등장하였습니다.\n\n" + "체력: " + this.bossHp + " / " + this.bossMaxHp + "\n" ;
            text += this.rewardText();
            text += "\n";

            text +=  "참가자 " + this.players.length + "명\n";

            this.players.forEach((p, i) => {
              text += "["+(i + 1)+"] " + _this.playerDamageText(p)+  "\n";
            });

          }





          return text;
        },
        attack: function(playerATT){
          var damage = (this.bossHp >= playerATT)?playerATT:this.bossHp;
          this.bossHp -= damage;
          if(this.bossHp == 0){
            this.isDead = true;
            this.onDead();
          }

          return damage;
        },
        onDead: function(){
          console.log("ondead1")

          this.playerSort();
          var _this = this;
          this.players.forEach((p, i) => {
            var reward = {
              redCube: _this.reward.redCube,
              eternalFlame: _this.reward.eternalFlame,
            };
            if(i == 0 || p.firstAttack){
              reward.redCube *= 2;
              reward.eternalFlame *= 2;
            }
            _this.players[i].reward = {};
            _this.players[i].reward.redCube = reward.redCube;
            _this.players[i].reward.eternalFlame = reward.eternalFlame;

          });

          console.log(this.players)
          console.log("ondead2")

          this.players.forEach(async (p, i) => {
            var muser = await db.MUser.findOne({
              where: {
                id: p.id
              }
            });


            muser.redcube += p.reward.redCube;
            muser.eternalflame += p.reward.eternalFlame;
            await muser.save();

          });
          console.log("ondead3")


        }
      }



      var segcjannel = client.channels.cache.get('970733359053541396');
      if(!segcjannel){
        segcjannel = client.channels.cache.get('968815702280650752');
      }
      var bossApearMessage = await segcjannel.send(boss.bossAppearMessageText());
      await Promise.all([
        bossApearMessage.react('🏹'),
      ]);
      const bossAttackFilter = (reaction, user) => {
        return  ['🏹'].includes(reaction.emoji.name) && user.id !== client.user.id;
      };
      var startTime = new Date();
      while(!boss.isDead || new Date() - startTime > TIMELIMIT){
        await bossApearMessage.awaitReactions(bossAttackFilter, { max: 1, time: 60000, errors: ['time'] })
          .then(async function(data) {
            const reaction = data.first();
            if(boss.isDead)return;
            if (reaction.emoji.name == '🏹') {
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
                  boss.players.push(user);

                  playerStat = maple.getPlayerStat(items, job);
                  var damage;
                  if(Math.random() < playerStat.crip){
                    damage = boss.attack(Math.floor(playerStat.statAtk * playerStat.penet / 100 * 2));
                  }
                  else{
                    damage = boss.attack(Math.floor(playerStat.statAtk * playerStat.penet / 100));
                  }

                  user.damage = damage;

                  // console.log(user);
                  if(boss.players.length == 0){
                    user.firstAttack = true;
                  }else{
                    user.firstAttack = false;
                  }
                  console.log("messagechanged")
                  bossApearMessage.edit(boss.bossAppearMessageText());

                }
              });
            }
          }).catch(async function(data) {
            // const reaction = data.first();
            // console.log(reaction);
            console.log(data);
          });
      }

      if(!boss.isDead){
        bossApearMessage.edit("엘리트 보스 처치에 실패했습니다.")
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
