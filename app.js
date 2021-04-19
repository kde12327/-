const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function endsWithStr(msg, str, content){
  if(msg.content.endsWith(str)){
    msg.channel.send(content);
  }
}
function includesStr(msg, str, content){
  if(msg.content.includes(str)){
    msg.channel.send(content);
  }
}

client.on('message', msg => {
  if(msg.author.username == '숭의관 봇') return;
  else if(msg.author.username == '꿀벌') return;
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
    default: ;
    
  }
  endsWithStr(msg, '뭐임?', '네~ 알려드렸읍니다~');
  endsWithStr(msg, '못참지', 'ㄹㅇㅋㅋ');
  endsWithStr(msg, '못 참지', 'ㄹㅇㅋㅋ');
  endsWithStr(msg, 'ㄱ?', 'ㄱㄱ');
  endsWithStr(msg, '기?', 'ㄱㄱ');
  includesStr(msg, '학집처', '드가자~ 드가자~');

});

client.login(token.token);
