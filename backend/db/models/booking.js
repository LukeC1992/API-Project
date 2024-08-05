"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Spots",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
        },
        onDelete: "CASCADE",
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          // isAfter: new Date().toString(),
          // validDate(val) {
          //   new Date(val) >= new Date();
          // },
        },
      },
      // validDate(val) {
      //   if (new Date(val) < new Date()) {
      //     throw new Error("startDate cannot be in the past")
      //   }
      // }
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          // isAfter: this.startDate,
          // validDate(val) {
          //   new Date(val) >= new Date(this.startDate);
          // },
          // validDate(val) {
          //   if (new Date(val) < new Date(this.startDate)) {
          //     throw new Error("endDate cannot be on or before startDate")
          //   }
          // },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
      defaultScope: {
        attributes: {
          exclude: ["updatedAt", "createdAt"],
        },
      },
      scopes: {
        booker: {
          attributes: ["spotId", "startDate", "endDate"],
        },
      },
    }
  );
  return Booking;
};
