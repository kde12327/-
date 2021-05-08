const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json");
const Enmap = require("enmap");
const fs = require("fs");
const config = require("./config/config.json");
const db = require("./models");
// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;


const COINMAX = 3.1;
const COINMIN = -3;
const COININTERVAL = 60000;
const COINPREFIX = '!';



// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    // If the file is not a JS file, ignore it (thanks, Apple)
    if (!file.endsWith(".js")) return;
    // Load the event file itself
    const event = require(`./events/${file}`);
    // Get just the event name from the file name
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    // without going into too many details, this means each event will be called with the client argument,
    // followed by its "normal" arguments, like message, member, etc etc.
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    // Load the command file itself
    let props = require(`./commands/${file}`);
    // Get just the command name from the file name
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    // Here we simply store the whole thing in the command Enmap. We're not running it right now.
    client.commands.set(commandName, props);
  });
});


client.on('ready', async function () {
  var sequelize = require('./models/index').sequelize;
  sequelize.sync();

  console.log(`Logged in as ${client.user.tag}!`);

  let timerId = setInterval(async () => {
    try {
      var [coin, created] = await db.Coin.findOrCreate({
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

client.login(token.token_test);
