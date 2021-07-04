
'use strict';
module.exports = (sequelize, DataTypes) => {
  const YatchLog = sequelize.define(
    'YatchLog',
    {
      id:{
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
      },
    	score: {
    		type: DataTypes.INTEGER,
    	},
      date: {
        type: DataTypes.DATE,
      },
    },
    {}
  );
  YatchLog.associate = function(models) {
    YatchLog.belongsTo(models.User, {
    });
  };
  return YatchLog;
};
