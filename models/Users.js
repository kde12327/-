
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id:{
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
      },
    	username: {
    		type: DataTypes.STRING,
    	},
      balance: {
        type: DataTypes.FLOAT,
      },
      coin: {
        type: DataTypes.FLOAT,
      },
      average: {
        type: DataTypes.FLOAT,
      }
    },
    {}
  );
  User.associate = function(models) {
  };
  return User;
};
