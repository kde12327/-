const db = require("../models");



const COININTERVAL = 60000;
const COINMAX = 3.1;
const COINMIN = -3;


module.exports = (client, message) => {
  var sequelize = require('../models/index').sequelize;
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
};
