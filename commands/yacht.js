const Discord = require('discord.js');

const db = require('../models');
const scoreEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '🃏', '🔢', '🏘️', '🔡', '🔠', '🎲'];
const yachtEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🔁', '🔴', '↩️'];

function showPlayerReadyString(game){
  var str = ""
  for(var i = 0; i < game.player.length; i++){
    str+=("Player "+(i+1)+" : " + game.player[i].username+"\n");
  }
  return str;
}

function joinString(game){
  return "플레이어 모집 중 입니다...\n\n"+showPlayerReadyString(game)+"\nJoin - :game_die:\nStart - ✅\nCancle - ❌";
}

function playerTurnChanceString(game, playerIdx, turn, chance){
  var str = "";
  str += `\n\n-- ${turn} --`;
  str += `\n\n-- Player ${playerIdx+1}: ${game.player[playerIdx].username} 차례 --`;
  str += `\n\n-- 남은 기회: ${chance} --`;
  return str;
}

function diceString(game, dices){
  var str  = "";
  str += `주사위: ${dices.dices[0]}    ${dices.dices[1]}    ${dices.dices[2]}    ${dices.dices[3]}    ${dices.dices[4]}\n`;
  str +=  `잠금  : ${dices.locks[0]}    ${dices.locks[1]}    ${dices.locks[2]}    ${dices.locks[3]}    ${dices.locks[4]}`;
  return str;
}
function scoreHintString(game, player, dices){
  var str  = "";

  for(var i = 0; i < player.scoreCard.score.length; i++){
    if(player.scoreCard.scoreCheck[i])continue;
    str += `${player.scoreCard.scoreStr[i]} ${scoreEmoji[i]}: \t${player.scoreCard.hintScore(i, dices)}\n`;
  }
  return str;
}

function showScore(game, i){
  var str = "";
  game.player.forEach((player , playerIdx) => {
    if(playerIdx != 0) str+='/';
    if(player.scoreCard.scoreCheck[i]){
      str+= player.scoreCard.score[i];
    }else{
      str+= '-';
    }
  });
  return str;
}
function showBonusScore(game){
  var str = "";
  game.player.forEach((player , playerIdx) => {
    if(playerIdx != 0) str+='/';
    if(player.scoreCard.isBonusCond()){
      str+= player.scoreCard.bonusScore;
    }else{
      str+= `(${player.scoreCard.bonusCondSum()}/63)`;
    }
  });
  return str;
}
function showOverallScore(game){
  var str = "";
  game.player.forEach((player , playerIdx) => {
    if(playerIdx != 0) str+='/';
    str += player.scoreCard.overall();
  });
  return str;
}

function scoreBoardString(game){
  var gameBoardEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`점수판`)
    .setDescription('입력시간제한 : 1분')
    .addFields(
      { name: '-----------', value: '점수판', inline: false },
      { name: `#1: Ones 1️⃣`, value: `점수: ${ showScore(game, 0)}`, inline: true },
      { name: `#2: Twos 2️⃣`, value: `점수: ${ showScore(game, 1)}`, inline: true },
      { name: `#3: Threes 3️⃣`, value: `점수: ${ showScore(game, 2)}`, inline: true },
      { name: `#4: Fours 4️⃣`, value: `점수: ${ showScore(game, 3)}`, inline: true },
      { name: `#5: Fives 5️⃣`, value: `점수: ${ showScore(game, 4)}`, inline: true },
      { name: `#6: Sixes 6️⃣`, value: `점수: ${ showScore(game, 5)}`, inline: true },
      { name: `1-6 보너스!🍀`, value: `점수:${ showBonusScore(game)}`, inline: false },
      { name: `#7: Choice🃏`, value: `점수: ${ showScore(game, 6)}`, inline: true },
      { name: `#8: Four of a Kind🔢`, value: `점수: ${ showScore(game, 7)}`, inline: true },
      { name: `#9: Full House🏘️`, value: `점수: ${ showScore(game, 8)}`, inline: true },
      { name: `#10: Small Straight🔡`, value: `점수: ${ showScore(game, 9)}`, inline: true },
      { name: `#11: Large Straight🔠`, value: `점수: ${ showScore(game, 10)}`, inline: true },
      { name: `#12: Yahtzee🎲`, value: `점수: ${ showScore(game, 11)}`, inline: true },
      { name: '총 점수 📃', value: `${showOverallScore(game)}`, inline: false },
    )
  return gameBoardEmbed;
}
function resultString(game){

  var gameBoardEmbed = new Discord.MessageEmbed()
    .setColor('#000000')
    .setTitle(`야추!`)
    .setDescription('결과:')

  var player = [];
  game.player.forEach((p, i) => {
    player.push({ name: p.username, score:  p.scoreCard.overall()});
  });
  player.sort(function(a, b){
    return a.score > b.score;
  })
  player.forEach((p, i) => {
    gameBoardEmbed.addField( `#${i+1}: ${p.name}`, `점수: ${p.score}`,  true);
  });
  return gameBoardEmbed;
}

async function reloadScoreBoard(game, scoreboardmsg){
  await scoreboardmsg.edit(scoreBoardString(game));
}



function Dices(){
  this.dices = [0, 0, 0, 0, 0];
  this.locks = [false, false, false, false, false];
  this.reRoll = function(){
    for(var i = 0; i < this.dices.length; i++){
      if(this.locks[i])continue;
      this.dices[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
}

function ScoreCard(){
  this.scoreStr = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'Choice', 'FourCard', 'FullHouse', 'S.Straight', 'L.Straight', 'Yacht'];
  this.score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.scoreCheck = [false, false, false, false, false, false, false, false, false, false, false, false];
  this.bonusScore = 0;
  this.overall = function(){
    var sum = 0;
    for(var i = 0; i < this.score.length; i++){
      sum += this.score[i];
    }
    sum += this.bonusScore;
    return sum;
  };
  this.bonusCondSum = function(){
    var sum = 0;
    for(var i = 0; i < 6; i++){
      sum += this.score[i];
    }
    return sum;
  }
  this.isBonusCond = function(){
    if(this.bonusCondSum() >= 63)return true;
    else return false;
  }
  this.addScore = function(index, dices){
    this.score[index] = this.hintScore(index, dices);
    this.scoreCheck[index] = true;
    if(index < 6){
      if(this.isBonusCond()){
        this.bonusScore = 35
      }
    }
  }
  this.hintScore = function(index, dices){
    var _scr = 0;
    var _arr = [0, 0, 0, 0, 0, 0];
    for(var i = 0; i < 5; i++){
      _arr[dices.dices[i] - 1] += 1;
    }
    if(index < 6 ){
      for(var i = 0; i < 5; i++){
        _scr += (dices.dices[i] === (index + 1))? (index + 1): 0;
      }

    }else if(index === 6){
      for(var i = 0; i < 5; i++){
        _scr += dices.dices[i];
      }
    }else if(index === 7){
      if((_arr.indexOf(4) !== -1) || (_arr.indexOf(5) !== -1)){
        for(var i = 0; i < 5; i++){
          _scr += dices.dices[i];
        }
      }else {
        _scr = 0;
      }
    }else if(index === 8){
      if(((_arr.indexOf(3) !== -1) && (_arr.indexOf(2)  !== -1))||(_arr.indexOf(5) !== -1)){
        for(var i = 0; i < 5; i++){
          _scr += dices.dices[i];
        }
      }else {
        _scr = 0;
      }
    }else if(index === 9){
      var indexs = [];
      _arr.forEach((e, i) => {if(e == 0)indexs.push(i)});
      if(
        (
          indexs.length == 2
          && (
            (_arr.indexOf(0) == 4 && _arr.indexOf(0, 5) == 5)
            || (_arr.indexOf(0) == 0 && _arr.indexOf(0, 1) == 5)
            || (_arr.indexOf(0) == 0 && _arr.indexOf(0, 1) == 1)
          )
        )
        || JSON.stringify(_arr) === JSON.stringify([1, 1, 1, 1, 1, 0])
        || JSON.stringify(_arr) === JSON.stringify([0, 1, 1, 1, 1, 1])
        || JSON.stringify(_arr) === JSON.stringify([1, 0, 1, 1, 1, 1])
        || JSON.stringify(_arr) === JSON.stringify([1, 1, 1, 1, 0, 1])
      ){
        _scr = 15;
      }else {
        _scr = 0;
      }
    }else if(index === 10){
      if(JSON.stringify(_arr) === JSON.stringify([1, 1, 1, 1, 1, 0])
      || JSON.stringify(_arr) === JSON.stringify([0, 1, 1, 1, 1, 1])){
        _scr = 30;
      }else {
        _scr = 0;
      }
    }else if(index === 11){
      if(_arr.indexOf(5) !== -1){
        _scr = 50;
      }else {
        _scr = 0;
      }
    }
    return _scr;
  }
}

exports.run = async (client, message, [action, args]) => {
  if(message.channel.name !== "yacht") return;
  if(message.author.bot) return;
  var game = {};
  game.player = [];
  game.player.push(message.author);

  if(action == "랭킹" || action == "rank" || action == "ranking"){
    try {
      const logs = await db.YatchLog.findAll({
        include: [
          {
            model: db.User,
          }
        ],
        limit: 10,
        order: [['score', 'DESC']]
      })
      const _rankEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('전체 랭킹 top 10')

      for(var i = 0; i < logs.length; i++){
        _rankEmbed.addField(`${i+1}등: ${logs[i].User.username}`, `점수: ${logs[i].score}`, true);
      }
      message.reply(_rankEmbed)

    } catch (e) {
      console.log(e)
    }
    return;
  }
  console.log(action)
  if(action != undefined){return;}

  // get user from db
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
  }catch(error){
    console.log(error)
  }

  var exit = false;
  var start = false;
  // console.log(game.player)
  var joinmsg = await message.channel.send(joinString(game)).then(msg =>{
    return msg;
  });
  var joinWaitmsg = await message.channel.send("대기.....").then(msg =>{
    return msg;
  });
  await Promise.all([
    joinmsg.react('🎲'),
    joinmsg.react('✅'), //주사위 굴리기
    joinmsg.react('❌'), //점수 바로 등록하기
  ]);
  joinWaitmsg.delete();

  const filter = (reaction, user) => {
    return  ['🎲','✅','❌'].includes(reaction.emoji.name) && user.id !== client.user.id;
  };
  while(!exit && !start){
    await joinmsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(async function(data) {
        const reaction = data.first();
        if (reaction.emoji.name === '🎲') {
          reaction.users.cache.each(user => {
            if(!game.player.includes(user) && !user.bot){
              game.player.push(user);
            }
          });
          joinmsg.edit(joinString(game));
        } else if (reaction.emoji.name === '✅' ) {
          var startFlag = false;
          reaction.users.cache.each(user => {
            if(game.player[0] == user && !user.bot){
              startFlag = true;
            }
          });
          if(startFlag){
            start = true;
          }
        } else if (reaction.emoji.name === '❌') {
          joinmsg.edit("게임 취소되었습니다.");
          exit = true;
        }
      }).catch(async function(data) {
        const reaction = data.first();
        console.log(reaction);
        joinmsg.edit("오류입니다. 응답시간이 지났거나, 리액션이 전부 표시되지 않은 상태에서 선택하였습니다.");
        console.log(data);
        stopFlag = true;
        exit = true;
      });
  }
  if(exit) return;
  joinmsg.edit(showPlayerReadyString(game)+'\n----------------');
  
  await Promise.all([
    joinmsg.reactions.removeAll()
  ]);

  await joinmsg.react('🔴');

  const stopFilter = (reaction, user) => {
    return  ['🔴'].includes(reaction.emoji.name);
  };

  joinmsg.awaitReactions(stopFilter, { max: 1, time: 1200000, errors: ['time'] })
  .then(async function(data) {
    const reaction = data.first();
    if (reaction.emoji.name === '🔴') {
      console.log(1)
      reaction.users.cache.each(user => {
        if(user == message.author && !user.bot){
          joinmsg.edit('게임이 중지되었습니다.');
          if(yachtmsg)yachtmsg.delete()
          if(waitmsg)waitmsg.delete()
          if(waitmsg)waitmsg.delete()
          if(scoremsg)scoremsg.delete()
          if(scoreWaitmsg)scoreWaitmsg.delete()

        }
      });
    }
  });

  const yachtFilter = (reaction, user) => {
    return ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','🔁','🔴','↩️'].includes(reaction.emoji.name) && user.id !== client.user.id;
  };
  const scoreFilter = (reaction, user) => {
    return ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣', '🃏', '🔢', '🏘️', '🔡', '🔠', '🎲'].includes(reaction.emoji.name) && user.id !== client.user.id;
  };
  game.player.forEach(p => {p.scoreCard = new ScoreCard();});
  var scoreboardmsg = await message.channel.send(scoreBoardString(game)).then(msg =>{
    return msg;
  });

  var yachtmsg = await message.channel.send("로딩중 ...").then(msg =>{
    return msg;
  });
  await Promise.all([
    yachtmsg.react('1️⃣'),
    yachtmsg.react('2️⃣'),
    yachtmsg.react('3️⃣'),
    yachtmsg.react('4️⃣'),
    yachtmsg.react('5️⃣'),
    yachtmsg.react('🔁'), //주사위 굴리기
    yachtmsg.react('🔴'), //점수 바로 등록하기
    yachtmsg.react('↩️'), //점수 바로 등록하기
  ]);
  for(var turn = 1; turn < 13; turn ++){

    for(var playerIdx = 0; playerIdx < game.player.length; playerIdx ++){

      var enrollFlag = false;
      var player = game.player[playerIdx];
      var dices = new Dices();
      if(turn != 1){
        var waitmsg = await message.channel.send("대기...").then(msg =>{
          return msg;
        });yachtEmoji
        for(var i = 0; i < yachtEmoji.length; i++){
          var users = yachtmsg.reactions.resolve(yachtEmoji[i]).users;
          if(users.resolve(player.id)){
            await yachtmsg.reactions.resolve(yachtEmoji[i]).users.remove(player.id);
          }
        }
        waitmsg.delete();
      }
      for(var chance = 2; chance >= 0; chance--){
        dices.reRoll();
        await yachtmsg.edit(playerTurnChanceString(game, playerIdx, turn, chance)  + "\n\n" +diceString(game, dices));
        if(chance == 0) break;
        stopFlag = false;
        if(chance != 2){
          var waitmsg = await message.channel.send("대기...").then(msg =>{
            return msg;
          });
          // waitmsg.delete();

          await Promise.all([
            yachtmsg.reactions.resolve('🔁').users.remove(player.id),
          ]);
          waitmsg.delete();
        }

        while(!stopFlag){

          await yachtmsg.awaitReactions(yachtFilter, { max: 1, time: 60000, errors: ['time'] })
            .then(async function(data) {
              const reaction = data.first();
              if (reaction.emoji.name === '1️⃣') {
                dices.locks[0] = true;
              }else if (reaction.emoji.name === '2️⃣') {
                dices.locks[1] = true;
              }else if (reaction.emoji.name === '3️⃣') {
                dices.locks[2] = true;
              }else if (reaction.emoji.name === '4️⃣') {
                dices.locks[3] = true;
              }else if (reaction.emoji.name === '5️⃣') {
                dices.locks[4] = true;
              }else if (reaction.emoji.name === '🔁') {
                stopFlag = true;

              }else if (reaction.emoji.name === '🔴') {
                stopFlag = true;
                enrollFlag = true;
              }else if (reaction.emoji.name === '↩️') {
                dices.locks = [false, false, false, false, false]
                var _waitmsg = await message.channel.send("대기...").then(msg =>{
                  return msg;
                });yachtEmoji
                for(var i = 0; i < yachtEmoji.length; i++){
                  var users = yachtmsg.reactions.resolve(yachtEmoji[i]).users;
                  if(users.resolve(player.id)){
                    await yachtmsg.reactions.resolve(yachtEmoji[i]).users.remove(player.id);
                  }
                }
                _waitmsg.delete();
              }
            }).catch(async function(data) {



            });
            await yachtmsg.edit(playerTurnChanceString(game, playerIdx, turn, chance)  + "\n\n" +diceString(game, dices));
        }
        if(enrollFlag) break;

      }
      // 점수 등록 페이즈
      var scoremsg = await message.channel.send(scoreHintString(game, player, dices) + "어디에 등록하시겠습니까?").then(msg =>{
        return msg;
      });
      var scoreWaitmsg = await message.channel.send("대기...").then(msg =>{
        return msg;
      });
      for(var i = 0; i < 12; i++){
        if(!player.scoreCard.scoreCheck[i]) {
          await scoremsg.react(scoreEmoji[i]);
        }

      }
      scoreWaitmsg.delete();
      stopFlag = false;
      while(!stopFlag){
        await scoremsg.awaitReactions(scoreFilter, { max: 1, time: 60000, errors: ['time'] })
          .then(async function(data) {
            const reaction = data.first();

            if (reaction.emoji.name === '1️⃣') {
              if(!player.scoreCard.scoreCheck[0]){
                player.scoreCard.addScore(0, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '2️⃣') {
              if(!player.scoreCard.scoreCheck[1]){
                player.scoreCard.addScore(1, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '3️⃣') {
              if(!player.scoreCard.scoreCheck[2]){
                player.scoreCard.addScore(2, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '4️⃣') {
              if(!player.scoreCard.scoreCheck[3]){
                player.scoreCard.addScore(3, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '5️⃣') {
              if(!player.scoreCard.scoreCheck[4]){
                player.scoreCard.addScore(4, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '6️⃣') {
              if(!player.scoreCard.scoreCheck[5]){
                player.scoreCard.addScore(5, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '🃏') {
              if(!player.scoreCard.scoreCheck[6]){
                player.scoreCard.addScore(6, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '🔢') {
              if(!player.scoreCard.scoreCheck[7]){
                player.scoreCard.addScore(7, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '🏘️') {
              if(!player.scoreCard.scoreCheck[8]){
                player.scoreCard.addScore(8, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '🔡') {
              if(!player.scoreCard.scoreCheck[9]){
                player.scoreCard.addScore(9, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '🔠') {
              if(!player.scoreCard.scoreCheck[10]){
                player.scoreCard.addScore(10, dices);
                stopFlag = true;
              }
            }else if (reaction.emoji.name === '🎲') {
              if(!player.scoreCard.scoreCheck[11]){
                player.scoreCard.addScore(11, dices);
                stopFlag = true;
              }
            }
          }).catch(async function(data) {
            stopFlag = true;
          });
      }
      reloadScoreBoard(game, scoreboardmsg);
      scoremsg.delete();


    }



  }

  await Promise.all([
    joinmsg.reactions.removeAll()
  ]);

  // 점수 집계 or 등수
  yachtmsg.delete();
  try {
    game.player.forEach(async (p, i) => {
      await db.YatchLog.create({
        score: p.scoreCard.overall(),
        date: new Date(),
        createAt: new Date(),
        updateAt: new Date(),
        UserId: p.id,
      })
    });

  } catch (e) {

  }
  var resultmsg = await message.channel.send(resultString(game)).then(msg =>{
    return msg;
  });


};
