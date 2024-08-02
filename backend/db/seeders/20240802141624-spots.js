'use strict';

const { Spot } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Spot.bulkCreate([
    {
      ownerId: 1,
      address: "123 Disney Lane",
      city: "San Francisco",
      state: "California",
      country: "United States of America",
      lat: 37.7645358,
      lng: -122.4730327,
      name: "App Academy",
      description: "Place where web developers are created",
      price: 123.45
    },
    {
      ownerId: 2,
      address: '456 Hershey Lane',
      city: "New York City",
      state: "New York",
      country: "United States of America",
      lat: 40.7306100,
      lng: -73.9352420,
      name: "Avengers HQ",
      description: "Defunct",
      price: 1.00
    },
    {
      ownerId: 2,
      address: "4095 Patterson Lake Road",
      city: "Hell",
      state: "Michigan",
      country: "United States of America",
      lat: 20.1526489,
      lng: -110.8451679,
      name: "Hell Saloon",
      description: "Devilish-themed bar/diner offering hearty American food & local live music to bikers & families.",
      price: 6.66
    },
    {
      ownerId: 3,
      address: "3011 Shawnee Drive",
      city: "Ft. Wayne",
      state: "Indiana",
      country: "United States of Americas",
      lat: 67.1847633,
      lng: 103.7181147,
      name: "Yellow Submarine",
      description: "A Quaint Yellow Family Home. We all live here.",
      price: 42.00
    },
    {
      ownerId: 1,
      address: "5525 Sleet Drive",
      city: "Indianapolis",
      state: "Indiana",
      country: "United States of America",
      lat: -43.1520004,
      lng: -89.1782498,
      name: "A House",
      description: "It's just a house.",
      price: 5.00
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const properties = await Spot.findAll();

    for(let property of properties){
      await property.destroy();
    }
  }
};
