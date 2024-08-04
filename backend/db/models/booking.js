'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId"
      });
      Booking.belongsTo(models.User, {
        foreignKey: "userId"
      })
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Spots"
      },
      onDelete: "CASCADE"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users"
      },
      onDelete: "CASCADE"
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        validDate(val){
          new Date(val) >= new Date()
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: this.startDate
      }
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};