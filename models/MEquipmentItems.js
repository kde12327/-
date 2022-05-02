
'use strict';
module.exports = (sequelize, DataTypes) => {
  const MEquipmentItem = sequelize.define(
    'MEquipmentItem',
    {
      id:{
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
    	type: {
    		type: DataTypes.STRING,
    	},
      level: {
        type: DataTypes.INTEGER,
      },
      rarity: {
        type: DataTypes.STRING,
      },
      additionalstr: {
        type: DataTypes.INTEGER,
      },
      additionaldex: {
        type: DataTypes.INTEGER,
      },
      additionalint: {
        type: DataTypes.INTEGER,
      },
      additionalluk: {
        type: DataTypes.INTEGER,
      },
      additionalstrdex: {
        type: DataTypes.INTEGER,
      },
      additionalstrint: {
        type: DataTypes.INTEGER,
      },
      additionalstrluk: {
        type: DataTypes.INTEGER,
      },
      additionaldexint: {
        type: DataTypes.INTEGER,
      },
      additionaldexluk: {
        type: DataTypes.INTEGER,
      },
      additionalintluk: {
        type: DataTypes.INTEGER,
      },
      additionalatk: {
        type: DataTypes.INTEGER,
      },
      additionalmatk: {
        type: DataTypes.INTEGER,
      },
      additionalbossdmg: {
        type: DataTypes.INTEGER,
      },
      additionaldmg: {
        type: DataTypes.INTEGER,
      },
      additionalallp: {
        type: DataTypes.INTEGER,
      },
      potential1: {
        type: DataTypes.STRING,
      },
      potential2: {
        type: DataTypes.STRING,
      },
      potential3: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  MEquipmentItem.associate = function(models) {
  };
  return MEquipmentItem;
};
