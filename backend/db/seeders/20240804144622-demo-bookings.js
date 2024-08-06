"use strict";

const { Booking } = require("../models");

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
    await Booking.bulkCreate(
      [
        {
          spotId: 2,
          userId: 1,
          startDate: "2034-10-30",
          endDate: "2034-11-02",
        },
        {
          spotId: 1,
          userId: 2,
          startDate: "2034-10-30",
          endDate: "2034-11-02",
        },
        {
          spotId: 2,
          userId: 3,
          startDate: "2035-01-01",
          endDate: "2035-02-01",
        },
        {
          spotId: 3,
          userId: 3,
          startDate: "2035-02-02",
          endDate: "2035-03-01",
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
    options.tableName = "Bookings";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
