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
        as: "Owner",
        foreignKey: "ownerId",
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
      });
      Spot.hasMany(models.Booking, {
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
        validate: {
          is: /[ a-zA-Z0-9]+/,
          notEmpty: true,
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[ a-zA-Z]+/,
          notEmpty: true,
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[ a-zA-Z]+/,
          notEmpty: true,
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[ a-zA-Z]+/,
          notEmpty: true,
        },
      },
      lat: {
        type: DataTypes.FLOAT(9, 7),
        allowNull: false,
        validate: {
          isFloat: true,
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.FLOAT(10, 7),
        allowNull: false,
        validate: {
          isFloat: true,
          min: -180,
          max: 180,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[ a-zA-Z]+/,
          notEmpty: true,
          len: [2, 49],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      price: {
        type: DataTypes.FLOAT(7, 2),
        allowNull: false,
        validate: {
          min: 0.01,
          isFloat: true,
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
      },
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
                spotId: spot.id,
              },
            });
            spot.setDataValue("numReviews", reviews ? reviews.length : null);

            const reviewTotal = reviews.reduce(
              (acc, el) => acc + el.dataValues.stars,
              0
            );
            const reviewAvg = reviewTotal / reviews.length;
            spot.setDataValue(
              "avgStarRating",
              reviewAvg ? reviewAvg.toFixed(1) : null
            );
            spot.setDataValue(
              "avgRating",
              reviewAvg ? reviewAvg.toFixed(1) : null
            );

            const previewImage = await sequelize.models.SpotImage.findOne({
              attributes: ["url"],
              where: {
                spotId: spot.id,
                preview: true,
              },
            });
            spot.setDataValue(
              "previewImage",
              previewImage ? previewImage.url : null
            );
          }
        },
      },
      scopes: {
        user: {
          attributes: {
            exclude: ["numReviews", "avgStarRating"],
          },
        },
        details: {
          attributes: {
            exclude: ["avgRating", "previewImage"],
          },
        },
        review: {
          attributes: {
            exclude: ["description", "createdAt", "updatedAt"],
          },
        },
      },
    }
  );
  return Spot;
};
