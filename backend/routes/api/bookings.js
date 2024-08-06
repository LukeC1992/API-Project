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

router.delete("/:id", requireAuth, async (req, res, next) => {
  let id = parseInt(req.params.id);
  const { user: currUser } = req;

  if (isNaN(id))
    return res.status(404).json({
      message:
        "We're sorry, but the page you are looking for does not exist :(",
    });

  const booking = await Booking.findByPk(id);

  if (!booking)
    return res.status(404).json({ message: "Booking couldn't be found" });

  const { startDate, endDate, userId } = booking.dataValues;

  const ownerId = await booking.getSpot().dataValues.ownerId;

  if (userId !== currUser.id && ownerId !== currUser.id)
    return res.status(403).json({ message: "Forbidden" });

  const now = new Date().getTime();
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();

  if (startTime <= now && endTime > now)
    return res
      .status(403)
      .json({ message: "Bookings that have been started can't be deleted" });

  booking.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
