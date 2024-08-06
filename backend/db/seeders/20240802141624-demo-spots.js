"use strict";

const { Spot } = require("../models");

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
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "1138 Royal St",
          city: "New Orleans",
          state: "Louisiana",
          country: "United States of America",
          lat: 29.9618375,
          lng: -90.0611732,
          name: "Lalaurie Mansion",
          description:
            "American Horror Story: Coven reignited interest in this famous French Quarter haunt.",
          price: 400.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 3,
          address: "525 S Winchester Blvd",
          city: "San Jose",
          state: "California",
          country: "United States of America",
          lat: 37.3183318,
          lng: -121.9510491,
          name: "Winchester Mystery House",
          description:
            "Following the death of her husband, rifle magnate William Wirt Winchester, Sarah Winchester commissioned a Victorian labyrinth designed to repel the vengeful spirits of the lives taken by her husband's guns.",
          price: 48.2,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "48 Monument Square",
          city: "Concord",
          state: "Massachusets",
          country: "United States of America",
          lat: 42.461624,
          lng: -71.34958,
          name: "Concord's Colonial Inn",
          description:
            "Due to the hotel's age and role during the American Revolutionary War, Concord's Colonial Inn in Concord, Massachusetts, is rumored to have a few resident ghosts.",
          price: 144.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "7696 Sam Snead Hwy",
          city: "Hot Springs",
          state: "Virginia",
          country: "United States of America",
          lat: 37.9971278,
          lng: -79.8328445,
          name: "The Omni Homestead Resort",
          description:
            "Being widely known for its more than 250 years of grand hospitality and as a favorite vacation spot for European royalty and former U.S. Presidents and their families.",
          price: 544.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "58 State Cir",
          city: "Annapolis",
          state: "Maryland",
          country: "United States of America",
          lat: 38.9786921,
          lng: -76.4935141,
          name: "Historic Inns of Annapolis",
          description:
            "The Maryland Inn, one of the Historic Inns of Annapolis in Annapolis, Maryland, is reportedly haunted by a variety of specters since it was established in the 1770s.",
          price: 329.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "30 Main Street",
          city: "Stockbridge",
          state: "Massachusets",
          country: "United States of America",
          lat: 42.2820201,
          lng: -73.3169042,
          name: "The Red Lion Inn",
          description:
            "Ghostly rumors swirl around The Red Lion Inn, in Stockbridge, Massachusetts, which has been visited by many paranormal investigators and mediums hoping to connect with guests from centuries past.",
          price: 329.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "250 Wyandotte St",
          city: "Bethlehem",
          state: "Pennsylvania",
          country: "United States of America",
          lat: 40.6122068,
          lng: -75.3870851,
          name: "The Sayre Mansion",
          description:
            "The spirits at The Sayre Mansion in Bethlehem, Pennsylvania, reportedly have mischievous natures.",
          price: 235.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "2 E Wheelock St",
          city: "Hanover",
          state: "New Hampshire",
          country: "United States of America",
          lat: 43.7021932,
          lng: -72.29137,
          name: "Hanover Inn Dartmouth",
          description:
            "Deep in the storied history of Dartmouth College, one of the oldest colleges in America, founded in 1769, are the scattered ghost stories of youth and romance torn asunder.",
          price: 453.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
        },
        {
          ownerId: 1,
          address: "60 School St",
          city: "Boston",
          state: "Massachusets",
          country: "United States of America",
          lat: 42.3577676,
          lng: -71.0626809,
          name: "Omni Parker House",
          description:
            "This hotel was opened by Harvey Parker and he was involved with the operations of the building until his death in 1884.",
          price: 289.0,
          numReviews: null,
          avgStarRating: null,
          avgRating: null,
          previewImage: null,
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
    options.tableName = "Spots";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
