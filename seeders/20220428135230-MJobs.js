'use strict';
// npx sequelize db:seed --seed 파일명
// npx sequelize db:seed --seed 20220428135230-MJobs.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('MJobs',
    [
      {
        id: 0,
        jobname: '전사',
        mainstat: 'STR',
        substat: 'DEX',
        isatk: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 1,
        jobname: '궁수',
        mainstat: 'DEX',
        substat: 'STR',
        isatk: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        jobname: '마법사',
        mainstat: 'INT',
        substat: 'LUK',
        isatk: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        jobname: '도적',
        mainstat: 'LUK',
        substat: 'DEX',
        isatk: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        jobname: '힘해적',
        mainstat: 'STR',
        substat: 'DEX',
        isatk: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        jobname: '덱해적',
        mainstat: 'DEX',
        substat: 'STR',
        isatk: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
