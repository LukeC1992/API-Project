"use strict";

const options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    options.tableName = "Spots";
    await queryInterface.addColumn(options, "numReviews", {
      allowNull: true,
    });
    await queryInterface.addColumn(options, "avgStarRating", {
      allowNull: true,
    });

    await queryInterface.addColumn(options, "avgRating", {
      allowNull: true,
    });

    await queryInterface.addColumn(options, "previewImage", {
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    options.tableName = "Spots";
    await queryInterface.removeColumn(options, "previewImage");
    await queryInterface.removeColumn(options, "avgRating");
    await queryInterface.removeColumn(options, "avgStarRating");
    await queryInterface.removeColumn(options, "numReviews");
  },
};
