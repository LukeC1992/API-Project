"use strict";

const { ReviewImage } = require("../models");

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
    await ReviewImage.bulkCreate(
      [
        {
          reviewId: 1,
          url: "https://media.theindychannel.com/photo/2017/10/12/Whispers%20Estate%20MapQuest_1507827185886_68649138_ver1.0_640_480.JPG",
        },
        {
          reviewId: 1,
          url: "https://i.ytimg.com/vi/bYjctNin1yU/maxresdefault.jpg",
        },
        {
          reviewId: 2,
          url: "https://cdn.greatnews.life/wp-content/uploads/2014/10/NWIHauntedFolklore.jpg",
        },
        {
          reviewId: 3,
          url: "https://res-4.cloudinary.com/dostuff-media/image/upload//w_1200,q_75,c_limit,f_auto/v1540913222/page-image-12606-528a5f2f-43c6-4330-86ac-efcc3b070c3d.jpg",
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
    options.tableName = "ReviewImages";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
