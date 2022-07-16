const db = require("../models");
const maple = require('../utils/maple/maple.js')



module.exports = async (client, message) => {
  var sequelize = require('../models/index').sequelize;
  sequelize.sync();

  var users = await db.MUser.findAll();

  for(var i = 0; i < users.length; i++){
    maple.manualUpdate(users[i].id);

  }


};
