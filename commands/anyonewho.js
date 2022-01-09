const Discord = require('discord.js');

function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}

exports.run = async (client, message, args) => {
  if(message.author.bot) return;
  var author = message.author;
  args = message.content.slice(client.config.prefix.length).trim().split("-")
  for(i = 0; i < args.length; i++){
    args[i] = args[i].trim();
  }
  // console.log(args)
  
  content = args[0].slice("anyonewho ".length);
  time = 300000;

  

  for(i = 0; i < args.length; i++){
    tmp = args[i].split("=");
    switch (tmp[0].trim()) {
      case "T":
      case "t":
      case "time":
        time = int(tmp[1]);
        break;
      // case "P":
      // case "p":
      // case "People":
      //   time = int(tmp[1]);
      //   break;
      default:
        break;
    }
    
    
  }
  msgtext = `
${content}

대기 인원:
`;

  currentTime = new Date();

  replyMessage = await message.channel.send(msgtext);


  await replyMessage.react('👍');

  const thumbsupFilter = (reaction, user) => {
    return  ['👍'].includes(reaction.emoji.name);
  };

  while(new Date - currentTime < time){
    try{
      data = await replyMessage.awaitReactions(thumbsupFilter, { max: 1, time: 5000, errors: ['time'] })

      const reaction = data.first();
      // console.log("누름");
      

      if (reaction.emoji.name === '👍') {
        msgtext = `
${content}

대기 인원:
`;
        reaction.users.cache.each(user => {
          if(!user.bot){
            msgtext += user.username + "\n";
            
          }
        });
        replyMessage.edit(msgtext);
      }
    }catch(exception){

    }
    
  }





};
