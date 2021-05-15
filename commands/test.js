const Discord = require('discord.js');

const db = require('../models');

function endsWithStr(message, str, content){
  if(message.content.endsWith(str)){
    message.channel.send(content);
  }
}
function startsWithdStr(message, str, content){
  if(message.content.startsWith(str)){
    message.channel.send(content);
  }
}
function includesStr(message, str, content){
  if(message.content.includes(str)){
    message.channel.send(content);
  }
}

exports.run = async (client, message, [action, args]) => {
  if(message.author.bot) return;
  var author = message.author;
  var msgtext = message.content.split("test")[1].trim();
  switch ( msgtext ) {
    case '프로필보기' :
      message.reply(message.author.displayAvatarURL());
      break;
    case '테이블호출' :
      const table = new Discord.MessageEmbed().setTitle("도움창제목이빈다").setColor('#A9A9F5').setDescription("도움창내용입니다");
      message.channel.send(table);
      break;
    default: ;

  }

  if(msgtext.startsWith('질문:')) {
    let str = msgtext.split('질문: ')[1];
    let choice = str.split('?');
    message.reply(choice[Math.floor(Math.random() * (choice.length - 1 - 0) + 0)].trim());
  }else if(msgtext.startsWith('선택지')) {
    var stjmsg = await message.channel.send("선택지입니다~").then(msg =>{
      return msg;
    });
    Promise.all([
      //     yachtmsg.react(emojiCharacters['1']),
      //     yachtmsg.react(emojiCharacters['2']),
      //     yachtmsg.react(emojiCharacters['3']),
      // yachtmsg.react(emojiCharacters['4']),
      // yachtmsg.react(emojiCharacters['5']),
      stjmsg.react('🔁'), //주사위 굴리기
      stjmsg.react('🔴'), //점수 바로 등록하기
    ]);
    const filter = (reaction, user) => {
      return ['🔁','🔴'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    await stjmsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(async function(collected) {
        const reaction = collected.first();
        if (reaction.emoji.name === '🔁') {
          stjmsg.edit("굴려~");
        } else if (reaction.emoji.name === '🔴') {
          stjmsg.edit("정지!");
        }
      }).catch(async function(collected) {
        stjmsg.edit("시간초과입니다.");
        stopFlag = true;
        exit = true;
      });
  }else if(msgtext.startsWith('emoji')) {
    console.log(client)
    message.reply(args);
  }

};
