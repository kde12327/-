
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Coin = sequelize.define(
    'Coin',
    {
      price: {
    		type: DataTypes.FLOAT,
    		unique: true,
    	},
    },
    {}
  );
  Coin.associate = function(models) {
  };
  return Coin;
};
