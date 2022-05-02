
'use strict';
module.exports = (sequelize, DataTypes) => {
  const MUser = sequelize.define(
    'MUser',
    {
      id:{
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
      },
    	username: {
    		type: DataTypes.STRING,
    	},
      level: {
        type: DataTypes.INTEGER,
      },
      redcube: {
        type: DataTypes.INTEGER,
      },
      eternalflame: {
        type: DataTypes.INTEGER,
      }
    },
    {}
  );
  MUser.associate = function(models) {
    MUser.hasMany(models.MEquipmentItem, {
    });
  };
  return MUser;
};
