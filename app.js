const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  switch ( msg.content ) {
    case 'ping':
      msg.reply('Pong!');
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
    default: ;
  }
});

client.login(token.token);
