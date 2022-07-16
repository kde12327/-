'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const data = {};



fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json');
  })
  .forEach(file => {
    const json = require(path.join(__dirname, file));
    data[file.split('.')[0]] = json;
  });


module.exports = data;
