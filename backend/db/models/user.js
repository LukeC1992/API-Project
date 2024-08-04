"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Spot, {
        foreignKey: "ownerId",
      });
      User.hasMany(models.Review, {
        foreignKey: "userId",
      });
      User.hasMany(models.Booking, {
        foreignKey: "userId"
      });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      firstName: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [2, 30],
          isCapitalized(val) {
            if (val[0] !== val[0].toUpperCase()) {
              throw new Error("First name must be capitalized.");
            }
          },
        },
      },
      lastName: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [2, 30],
          isCapitalized(val) {
            if (val[0] !== val[0].toUpperCase()) {
              throw new Error("Last name must be capitalized.");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "createdAt", "updatedAt"],
        },
      },
      scopes: {
        owner: {
          attributes: {
            exclude: [
              "hashedPassword",
              "createdAt",
              "updatedAt",
              "email",
              "username",
            ],
          },
        },
      },
    }
  );
  return User;
};
