const db = require('../models');

module.exports = async (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(client.config.prefix) !== 0) {
    const noprefixcmd = client.commands.get("noprefix");
    noprefixcmd.run(client, message, args);
    return;
  }

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) {
    return;
  }

  // When use command add user.
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

  // Run the command
  cmd.run(client, message, args);
};
