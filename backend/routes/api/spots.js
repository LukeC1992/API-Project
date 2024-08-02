const express = require("express");
const { Spot } = require('../../db/models');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require('../../utils/auth.js');


const router = express.Router();


const validateSpot = [
      check("address")
            .exists({ checkFalsy: true })
            .notEmpty()
            .withMessage("Street address is required"),
      check("city")
            .exists({ checkFalsy: true })
            .notEmpty()
            .withMessage("City is required"),
      check("state")
            .exists({ checkFalsy: true })
            .notEmpty()
            .withMessage("State is required"),
      check("country")
            .exists({ checkFalsy: true })
            .notEmpty()
            .withMessage("Country is required"),
      check("lat")
            .exists({ checkFalsy: true })
            .notEmpty()
            .withMessage("Latitude must be within -90 and 90"),
      check("lng")
            .exists({ checkFalsy: true })
            .notEmpty()
            .withMessage("Longitude must be within -180 and 180"),
      check("name")
            .exists({ checkFalsy: true })
            .notEmpty()
            .withMessage("Name must be less than 50 characters"),
      check("description")
            .exists({ checkFalsy: true })
            .notEmpty()
            .withMessage("Description is required"),
      check("price")
            .exists({ checkFalsy: true })
            .notEmpty()
            .withMessage("Price per day must be a positive number"),
      handleValidationErrors,
];


//GET all spots by current user - api/spots/current
router.get('/current', requireAuth, async (req, res, next) => {
      const userId = req.user.id;

      const allSpots = await Spot.findAll({
            where: {
                  ownerId: userId
            }
      });

      res.json(allSpots);
})

//GET spot by spotId - api/spots/:spotId
router.get('/:spotId', async (req, res, next) => {
      const spotId = req.params.spotId;

      const number = parseInt(spotId)
      console.log(number);
      if(typeof number === 'number' && !isNaN(number)){
            const spot = await Spot.findByPk(number);
            if(spot){
                  return res.json(spot);
            }
      }

      res.status(404).json({
            message: "Spot couldn't be found"
      })
})


//GET all spots - api/spots
router.get('/', async (req, res) => {
      const spots = await Spot.unscoped().findAll();

      res.json(spots)
})

//POST new spot - api/spots
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
      const userId = req.user.id;
      const { address, city, state, country, lat, lng, name, description, price } = req.body;

      // if(!userId){
      //       const err = new Error("Must be logged in to list a spot");
      //       next(err);
      // };

      const newSpot = await Spot.create({
            ownerId: userId,
            ...req.body,
      });

      res.json(newSpot);
})

module.exports = router