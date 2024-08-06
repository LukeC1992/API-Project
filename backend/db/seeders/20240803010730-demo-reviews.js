"use strict";

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
  options.validate = true;
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
    await Review.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          review: "asdfasdfasdfasdfasdfasdfasdf",
          stars: 4,
        },
        {
          spotId: 1,
          userId: 2,
          review: "fdsafdsafdsafdsafdsafdsafdsa",
          stars: 2,
        },
        {
          spotId: 1,
          userId: 3,
          review: "fadsfadsfadsfadsfadsfadsfads",
          stars: 5,
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Reviews";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
