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
    await queryInterface.addColumn(
      "Spots",
      "numReviews",
      {
        type: Sequelize.VIRTUAL,
        allowNull: true,
      },
      options
    );
    await queryInterface.addColumn(
      "Spots",
      "avgStarRating",
      {
        type: Sequelize.VIRTUAL,
        allowNull: true,
      },
      options
    );

    await queryInterface.addColumn(
      "Spots",
      "avgRating",
      {
        type: Sequelize.VIRTUAL,
        allowNull: true,
      },
      options
    );

    await queryInterface.addColumn(
      "Spots",
      "previewImage",
      {
        type: Sequelize.VIRTUAL,
        allowNull: false,
      },
      options
    );
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
