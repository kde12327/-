const db = require("../models");
const maple = require('../commands/maple.js')


const MAPLEBOSSAPEARPERCENTAGE = 1 / 30;
// const MAPLEBOSSAPEARPERCENTAGE = 1;

const TIMELIMIT = 30 * 60 * 1000;

const emoji_eternalrebirthflame = "<:eternalrebirthflame:971656195855241227>";
const emoji_redcube = "<:redcube:971655681730035722>";


module.exports = async (client, message) => {
  var sequelize = require('../models/index').sequelize;
  sequelize.sync();
  if(Math.random() < MAPLEBOSSAPEARPERCENTAGE){
    try {

      var _rand = Math.random();
      bossHp = 20000 + Math.floor(Math.pow(_rand, 2) * 100000);
      // bossHp = 2709 +  1; // test



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
            text += "---" + emoji_redcube + "레드 큐브: " + this.reward.redCube + "개\n";
          }
          if(this.reward.eternalFlame > 0){
            text += "---" + emoji_eternalrebirthflame + "영원한 환생의 불꽃: " + this.reward.eternalFlame + "개\n";
          }
          return text;
        },
        playerRewardText: function(p){
          var text = "";
          if(this.reward.redCube > 0){
            text += emoji_redcube + "레드 큐브: " + p.reward.redCube + "개 ";
          }
          if(this.reward.eternalFlame > 0){
            text += emoji_eternalrebirthflame + "영원한 환생의 불꽃: " + p.reward.eternalFlame + "개 ";
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
          var text = "--------------------------\n";
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
              var str = "" + ((p.firstAttack == true)?":one:":"") + ((i == 0)?":first_place:":"") + ((p.spoon == true)?"🥄":"");
              text += "["+(i + 1)+"] " + str + p.username + ": " + _this.playerRewardText(p) + "\n";
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
          text += "\n--------------------------\n";






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


        }
      }



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
          bossApearMessage.react('🏹'),
        ]);
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

                  if(boss.players.length == 0){
                    user.firstAttack = true;
                  }else{
                    user.firstAttack = false;
                  }

                  boss.players.push(user);

                  playerStat = maple.getPlayerStat(items, job);



                  var damage;
                  if(Math.random() * 100< playerStat.crip){
                    damage = Math.floor(playerStat.statAtk * playerStat.penet / 100 * 2);
                    user.damage = (damage > boss.bossHp)? boss.bossHp: damage ;

                    boss.attack(user.damage);
                  }
                  else{
                    damage = Math.floor(playerStat.statAtk * playerStat.penet / 100);
                    user.damage = (damage > boss.bossHp)? boss.bossHp:damage ;
                    boss.attack(user.damage);
                  }


                  // console.log(user);

                  bossApearMessage.edit(boss.bossAppearMessageText());

                }
              });
            }else if(reaction.emoji.name == "🥄"){
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


                  if(boss.players.length == 0){
                    user.firstAttack = true;
                  }else{
                    user.firstAttack = false;
                  }

                  boss.players.push(user);
                  user.spoon = true;


                  user.damage = 100;
                  boss.attack(user.damage);


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
