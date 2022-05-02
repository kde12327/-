
'use strict';
module.exports = (sequelize, DataTypes) => {
  const MJob = sequelize.define(
    'MJob',
    {
      id:{
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
      },
    	jobname: {
    		type: DataTypes.STRING,
    	},
      mainstat: {
        type: DataTypes.INTEGER,
      },
      substat: {
        type: DataTypes.INTEGER,
      },
      isatk: {
        type: DataTypes.BOOLEAN,
      }
    },
    {}
  );
  MJob.associate = function(models) {
    MJob.hasMany(models.MUser, {
    });
  };
  return MJob;
};
