const db = require("../models");



const COININTERVAL = 60000;
const MAPLEINTERVAL = 60000;

// const COINMAX = 3.1;
// const COINMIN = -3;


module.exports = (client, message) => {
  var sequelize = require('../models/index').sequelize;
  sequelize.sync();

  console.log(`Logged in as ${client.user.tag}!`);

  let coinTimerId = setInterval(async () => {
    try {
      var [coin, created] = await db.Coin.findOrCreate({
        where: {
          id: 1
        },
        defaults: {
          price: '100',
        },
      })
      var COINMAX = 3 + 3 * ((100 - coin.price)/80);
      var COINMIN = -3 + 3 * ((100 - coin.price)/80);

      var next = parseFloat(coin.price + coin.price * (Math.random() * (COINMAX - COINMIN) + COINMIN) / 100).toFixed(2);
      coin.price = (next > 0) ? next: 0;
      console.log('SEG coin price['+ new Date() +']: '+coin.price);
      console.log(COINMAX, COINMIN);
      await coin.save();
      var segcjannel = client.channels.cache.get('836539076785078272');
      segcjannel.send('SEG coin price['+ new Date() +']: '+coin.price);
    } catch (e) {
      console.log(e);
    } finally {

    }
  }, COININTERVAL);

  let mapleTimerId = setInterval(async () => {
    client.emit('maplestoryboss');

  }, MAPLEINTERVAL);

  client.emit('mapleupdate');

};
