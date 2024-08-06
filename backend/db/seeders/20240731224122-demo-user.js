"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
  options.validate = true;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "Demo",
          lastName: "Lition",
        },
        {
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password1"),
          firstName: "Fake",
          lastName: "User",
        },
        {
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "Fake",
          lastName: "User",
        },
        {
          email: "user3@user.io",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Fake",
          lastName: "User",
        },
        {
          email: "user4@user.io",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password4"),
          firstName: "Fake",
          lastName: "User",
        },
        {
          email: "user5@user.io",
          username: "FakeUser5",
          hashedPassword: bcrypt.hashSync("password5"),
          firstName: "Fake",
          lastName: "User",
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
