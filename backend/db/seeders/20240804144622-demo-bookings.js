'use strict';

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await ReviewImage.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: "2024-10-30",
        endDate: "2024-11-02",
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2025-01-01",
        endDate: "2025-02-01",
      },
      {
        spotId: 3,
        userId: 3,
        startDate: "2025-02-02",
        endDate: "2025-03-01",
      },
    ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "ReviewImages";
    return queryInterface.bulkDelete(options, {}, {});
  }
};
