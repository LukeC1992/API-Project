"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
        },
        onDelete: "CASCADE",
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          is: /[ a-zA-Z0-9]+/,
          shorten(val) {
            return val.trim();
          },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[ a-zA-Z]+/,
          shorten(val) {
            return val.trim();
          },
          notEmpty: true,
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[ a-zA-Z]+/,
          shorten(val) {
            return val.trim();
          },
          notEmpty: true,
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[ a-zA-Z]+/,
          shorten(val) {
            return val.trim();
          },
          notEmpty: true,
        },
      },
      lat: {
        type: DataTypes.DECIMAL(9, 7),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: -180,
          max: 180,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[ a-zA-Z]+/,
          shorten(val) {
            return val.trim();
          },
          notEmpty: true,
          len: [2, 49],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      price: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        validate: {
          min: 0.01,
          isDecimal: true,
        },
      },
      numReviews: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue("numReviews");
        },
      },
      avgStarRating: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue("avgStarRating");
        },
      },
      avgRating: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue("avgRating");
        },
      },
      previewImage: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue("previewImage");
        },
      }
    },
    {
      sequelize,
      modelName: "Spot",
      hooks: {
        async afterFind(spots, options) {
          if (!spots) return;
          const isArray = Array.isArray(spots);
          const instances = isArray ? spots : [spots];

          for (const spot of instances) {
            const reviews = await sequelize.models.Review.findAll({
              attributes: ["stars"],
              where: {
                spotId: spot.id
              },
            });
            spot.setDataValue(
              "numReviews",
              reviews ? reviews.length : null
            );

            const reviewTotal = reviews.reduce((acc, el) => acc + el.dataValues.stars, 0);
            const reviewAvg = reviewTotal / reviews.length;
            spot.setDataValue(
              "avgStarRating",
              reviewAvg ? reviewAvg : null
            );
            spot.setDataValue(
              "avgRating",
              reviewAvg ? reviewAvg : null
            );

            const previewImage = await sequelize.models.SpotImage.findOne({
              attributes: ["url"],
              where: {
                spotId: spot.id,
                preview: true
              },
            });
            spot.setDataValue(
              "previewImage",
              previewImage ? previewImage.url : null
            );
          }
        },
      },
    }
  );
  return Spot;
};
