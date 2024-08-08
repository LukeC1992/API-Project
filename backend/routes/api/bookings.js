const express = require("express");
const { Booking, Spot } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth, checkDate } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { Op } = require("sequelize");

const router = express.Router();

async function checkBookings(req, res, next) {
  const bookingId = parseInt(req.params.bookingId);
  let { startDate, endDate } = req.body;

  if (isNaN(bookingId)) return next();

  const updateBooking = await Booking.findByPk(bookingId);

  if (!updateBooking)
    return res.status(404).json({
      message: "Booking couldn't be found",
    });

  const { spotId } = updateBooking.dataValues;

  const startBooking = await Booking.findAll({
    where: {
      spotId: spotId,
      id: {
        [Op.ne]: bookingId,
      },
      [Op.or]: [
        {
          startDate: new Date(startDate),
        },
        {
          [Op.and]: [
            {
              startDate: {
                [Op.gte]: new Date(startDate),
              },
            },
            {
              endDate: {
                [Op.lte]: new Date(endDate),
              },
            },
          ],
        },
        {
          startDate: {
            [Op.lte]: new Date(startDate),
          },
          endDate: {
            [Op.gte]: new Date(startDate),
          },
        },
      ],
    },
  });

  const endBooking = await Booking.findAll({
    where: {
      spotId: spotId,
      id: {
        [Op.ne]: bookingId,
      },
      [Op.or]: [
        {
          endDate: new Date(endDate),
        },
        {
          [Op.and]: [
            {
              startDate: {
                [Op.gte]: new Date(startDate),
              },
            },
            {
              endDate: {
                [Op.lte]: new Date(endDate),
              },
            },
          ],
        },
        {
          startDate: {
            [Op.lte]: new Date(endDate),
          },
          endDate: {
            [Op.gte]: new Date(endDate),
          },
        },
      ],
    },
  });

  const err = new Error(
    "Sorry, this spot is already booked for the specified dates"
  );
  err.errors = {};
  if (startBooking.length) {
    err.errors.startDate = "Start date conflicts with an existing booking";
  }
  if (endBooking.length) {
    err.errors.endDate = "End date conflicts with an existing booking";
  }

  err.status = 403;
  if (startBooking.length || endBooking.length) {
    return next(err);
  }
  next();
}

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
      const booking = {
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
      };
      return booking;
    })
  );
  res.json({ Booking: bookingsWithSpot });
});

// Edit a Booking - PUT /api/bookings/:bookingId
router.put(
  "/:bookingId",
  requireAuth,
  checkDate,
  checkBookings,
  async (req, res, next) => {
    const bookingId = parseInt(req.params.bookingId);

    const booking = await Booking.findByPk(bookingId);

    if (booking.dataValues.endDate < new Date())
      return res
        .status(403)
        .json({ message: "Past bookings can't be modified" });

    if (
      booking.dataValues.startDate < new Date() &&
      booking.dataValues.endDate > new Date()
    )
      return res
        .status(403)
        .json({ message: "Current bookings can't be modified" });

    if (req.user.id !== booking.dataValues.userId)
      return res.status(403).json({ message: "Forbidden" });

    const updatedBooking = await booking.update({
      ...req.body,
    });

    res.json(updatedBooking);
  }
);

//DELETE a booking -- /api/bookings/:bookingId
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

  const spot = await booking.getSpot();

  if (userId !== currUser.id && spot.dataValues.ownerId !== currUser.id)
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
