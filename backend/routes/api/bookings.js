const express = require("express");
const { Booking, Spot } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");

const router = express.Router();

//Get all of the Current User's Bookings - GET /api/bookings/current
router.get("/current", requireAuth, async (req, res, next) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [{ model: Spot }],
  });

  const bookingsWithSpot = await Promise.all(
    bookings.map(async (el) => {
      const spot = await Spot.scope("review").findByPk(el.Spot.id);
      console.log("el", el);
      return {
        //TODO match readme format
        Bookings: [
          {
            ...el.dataValues,
            Spot: {
              id: spot.dataValues.id,
              ownerId: spot.dataValues.ownerId,
              address: spot.dataValues.address,
              city: spot.dataValues.city,
              state: spot.dataValues.state,
              country: spot.dataValues.country,
              lat: spot.dataValues.lat,
              lng: spot.dataValues.lng,
              name: spot.dataValues.name,
              price: spot.dataValues.price,
              previewImage: spot.dataValues.previewImage,
            },
          },
        ],
      };
    })
  );
  res.json(bookingsWithSpot[0]);
});

module.exports = router;
