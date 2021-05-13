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

exports.run = async (client, message, [action, volume]) => {
  if(message.author.bot) return;
  var author = message.author;
  switch ( message.content ) {
    case '도움!':
      message.reply(`
        송수는?/ 학인이는?/ 꿀벌 입장~/ 꼴벌 입장~/ ???/ 따봉/ 떴다!/ 학집비?/ - 뭐임?/ - 못참지/ - 못 참지/ - ㄱ?/ - 기?/ -학집처-
        `);
      break;
    case '송수는?':
      message.channel.send('바보다!');
      message.channel.send('<:24:757596444948693072>');
      break;
    case '학인이는?':
      message.channel.send('티니아가 없다!');
      message.channel.send('<:not_hak:829933350809894915>');
      message.channel.send('<:24:757596444948693072>');
      break;
    case '꿀벌 입장~':
      message.channel.send('<:24:757596444948693072>');
      message.channel.send('<:24:757596444948693072> <:24:757596444948693072>');
      message.channel.send('<:24:757596444948693072> <:24:757596444948693072> <:24:757596444948693072>');
      break;
    case '꼴벌 입장~':
      message.channel.send('<:22:757596543846056068>');
      message.channel.send('<:22:757596543846056068> <:22:757596543846056068>');
      message.channel.send('<:22:757596543846056068> <:22:757596543846056068> <:22:757596543846056068>');
      break;
    case '???':
      message.channel.send('<:hakinban:825624343316922401><:hakinban:825624343316922401><:hakinban:825624343316922401>');
      break;
    case '따봉':
      message.channel.send('<:92:793980116081442856>');
      message.channel.send('<:19:757596967005061120>');
      message.channel.send('<:18:757596955143700520>');
      message.channel.send('<:20:757596978673877155>');
      message.channel.send('<:36:759268501910192129>');
      break;
    case '떴다!':
      message.react('<:92:793980116081442856>');
      message.react('<:19:757596967005061120>');
      message.react('<:18:757596955143700520>');
      message.react('<:20:757596978673877155>');
      message.react('<:36:759268501910192129>');
      break;
    case '학집비?':
      message.channel.send('네~ 비었습니다~');
      break;
    case '프로필보기' :
      message.reply(message.author.displayAvatarURL());
      break;
    case '테이블호출' :
      const table = new Discord.MessageEmbed().setTitle("도움창제목이빈다").setColor('#A9A9F5').setDescription("도움창내용입니다");
      message.channel.send(table);
      break;
    default: ;

  }
  endsWithStr(message, '뭐임?', '네~ 알려드렸읍니다~');
  endsWithStr(message, '못참지', 'ㄹㅇㅋㅋ');
  endsWithStr(message, '못 참지', 'ㄹㅇㅋㅋ');
  endsWithStr(message, 'ㄱ?', 'ㄱㄱ');
  endsWithStr(message, '기?', 'ㄱㄱ');
  includesStr(message, '학집처', '드가자~ 드가자~');


  if(message.content.startsWith('질문:'))
  {
    let str = message.content.split('질문: ')[1];
    let choice = str.split('?');
    message.reply(choice[Math.floor(Math.random() * (choice.length - 1 - 0) + 0)].trim());
  }

};
