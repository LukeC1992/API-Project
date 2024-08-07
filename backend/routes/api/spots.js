const express = require("express");
const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { check, query } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth, checkDate } = require("../../utils/auth.js");
const { Op } = require("sequelize");
const e = require("express");

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
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ min: 0.01 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const validateParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query("size")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be between 1 and 20"),
  query("maxLat")
    .optional()
    .isFloat({ max: 90 })
    .withMessage("Maximum latitude is invalid"),
  query("minLat")
    .optional()
    .isFloat({ min: -90 })
    .withMessage("Minimum latitude is invalid"),
  query("maxLng")
    .optional()
    .isFloat({ max: 180 })
    .withMessage("Maximum longitude is invalid"),
  query("minLng")
    .optional()
    .isFloat({ min: -180 })
    .withMessage("Minimum Longitude is invalid"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

//GET all spots by current user - GET api/spots/current
router.get("/current", requireAuth, async (req, res, next) => {
  const userId = req.user.id;

  const spots = await Spot.scope("user").findAll({
    where: {
      ownerId: userId,
    },
  });

  res.json({ Spots: spots });
});

//POST image by Spot's id - api/spots/:spotId/images
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const id = parseInt(req.params.spotId);
  const userId = req.user.id;

  if (isNaN(id))
    return res.status(404).json({
      message:
        "We're sorry, but the page you are looking for does not exist :(",
    });

  const spot = await Spot.findByPk(id);

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  if (userId !== spot.dataValues.ownerId)
    return res.status(403).json({ message: "Forbidden" });
  //If preview true set current preview to false
  const previewImage = await SpotImage.findOne({
    where: {
      preview: true,
    },
  });

  if (req.body.preview && previewImage) {
    previewImage.update({
      preview: false,
    });
  }

  const image = await SpotImage.create({ spotId: id, ...req.body });
  return res.status(201).json(image);
});

//Get all reviews by a spot's id - GET /api/spots/:spotId/reviews
router.get("/:spotId/reviews", async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);

  if (isNaN(spotId))
    return res.status(404).json({
      message:
        "We're sorry, the resource you are looking for does not exist :(",
    });

  const spot = await Spot.findByPk(spotId);

  if (!spot)
    return res.status(404).json({
      message: "Spot couldn't be found",
    });

  const reviews = await spot.getReviews({
    include: [
      {
        model: User.scope("owner"),
        require: true,
      },
      {
        model: ReviewImage.scope("defaultScope"),
      },
    ],
  });

  return res.json({ Reviews: reviews });
});

//Get all Bookings for a Spot based on the Spot's id - GET /api/spots/:spotId/bookings
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);
  const spot = await Spot.findByPk(spotId);

  if (!spot)
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  if (!isNaN(spotId)) {
    if (req.user.id === spot.dataValues.ownerId) {
      const bookings = await Booking.unscoped().findAll({
        where: { spotId },
        include: [{ model: User.scope("owner") }],
      });
      return res.json(bookings);
    }

    const bookings = await Booking.scope("booker").findAll({
      where: {
        spotId,
      },
    });
    return res.json(bookings);
  }
});

async function checkBookings(req, res, next) {
  const spotId = parseInt(req.params.spotId);
  let { startDate, endDate } = req.body;

  const startBooking = await Booking.findAll({
    where: {
      spotId: spotId,
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

  console.log("start", startBooking, "end", endBooking);

  const err = new Error("Booking Conflict");
  err.errors = {};

  if (startBooking.length) {
    err.errors.startDate = "Start date conflicts with an existing booking";
  }
  if (endBooking.length) {
    err.errors.endDate = "End date conflicts with an existing booking";
  }

  err.title = "BookingConflict";
  err.message = "Sorry, this spot is already booked for the specified dates";
  err.status = 403;

  if (startBooking.length || endBooking.length) {
    return next(err);
  }

  next();
}

//Create a Booking from a Spot based on the Spot's id - POST api/spots/:spotId/bookings
router.post(
  "/:spotId/bookings",
  requireAuth,
  checkDate,
  checkBookings,
  async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const { startDate, endDate } = req.body;

    if (isNaN(spotId))
      return res.status(404).json({
        message: "We're sorry, the page you are looking for does not exist :(",
      });

    const spot = await Spot.findByPk(spotId);

    if (!spot)
      return res.status(404).json({ message: "Spot couldn't be found" });

    if (req.user.id === spot.dataValues.ownerId)
      return res
        .status(403)
        .json({ message: "Can not book spot owned by User" });

    const newBooking = await Booking.create({
      spotId,
      userId: req.user.id,
      ...req.body,
    });

    return res.status(201).json(newBooking);
  }
);

//Create a Review for a Spot based on the Spot's id - POST api/spots/:spotId/reviews
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);

    if (isNaN(spotId))
      return res.status(404).json({
        message: "We're sorry, the page you are looking for does not exist :(",
      });

    const spot = await Spot.findByPk(spotId);

    if (!spot) return res.status(404).json({ message: "Spot could not found" });

    const userReviews = await Review.findOne({
      where: {
        userId: req.user.id,
        spotId,
      },
    });

    if (userReviews)
      return res.status(500).json({
        message: "User already has a review for this spot",
      });

    const newReview = await Review.create({
      userId: req.user.id,
      spotId,
      ...req.body,
    });

    return res.status(201).json(newReview);
  }
);

//GET spot by spotId - GET api/spots/:spotId
router.get("/:spotId", async (req, res, next) => {
  const id = parseInt(req.params.spotId);

  if (!isNaN(id)) {
    const spot = await Spot.scope("details").findOne({
      where: id,
      include: [
        {
          model: SpotImage.scope("defaultScope"),
          require: true,
        },
        {
          model: User.scope("owner"),
          as: "Owner",
          require: true,
        },
      ],
    });
    if (spot) {
      return res.json(spot);
    }
  }

  res.status(404).json({
    message: "Spot couldn't be found",
  });
});

//get all spots - GET api/spots
router.get("/", validateParams, async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;
  const where = {};
  where.lat = {};
  where.lat[Op.and] = [];
  where.lng = {};
  where.lng[Op.and] = [];
  where.price = {};
  where.price[Op.and] = [];

  minLat = parseFloat(minLat);
  if (!isNaN(minLat)) {
    where.lat[Op.and].push({ lat: { [Op.gte]: minLat } });
  }

  maxLat = parseFloat(maxLat);
  if (!isNaN(maxLat)) {
    where.lat[Op.and].push({ lat: { [Op.lte]: maxLat } });
  }

  minLng = parseFloat(minLng);
  if (!isNaN(minLng)) {
    where.lng[Op.and].push({ lng: { [Op.gte]: minLng } });
  }

  maxLng = parseFloat(maxLng);
  if (!isNaN(maxLng)) {
    where.lng[Op.and].push({ lng: { [Op.lte]: maxLng } });
  }

  minPrice = parseFloat(minPrice);
  if (!isNaN(minPrice)) {
    where.price[Op.and].push({ price: { [Op.gte]: minPrice } });
  }

  maxPrice = parseFloat(maxPrice);
  if (!isNaN(maxPrice)) {
    where.price[Op.and].push({ price: { [Op.lte]: maxPrice } });
  }

  size = parseInt(size);
  page = parseInt(page);

  if (isNaN(page) || page <= 0) page = 1;
  if (isNaN(size) || size <= 0 || size > 20) size = 20;

  const query = { where, limit: size, offset: size * (page - 1) };
  const spots = await Spot.scope("user").findAll(query);

  return res.json({ Spots: spots, page, size });
});

//Edit a spot - PUT api/spots/:spotId
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  const userId = req.user.id;
  const id = parseInt(req.params.spotId);

  if (isNaN(id))
    return res.status(404).json({
      message: "We're sorry, the page you are looking for does not exist",
    });

  const spot = await Spot.findByPk(id);

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  const { ownerId } = spot.dataValues;

  if (userId !== ownerId)
    return res.status(403).json({
      message: "Forbidden",
    });

  const updatedSpot = await spot.update({ ownerId, ...req.body });
  return res.json(updatedSpot);
});

//Delete a spot - DELETE api/spots/:spotId
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const id = parseInt(req.params.spotId);

  if (isNaN(id))
    return res.status(404).json({
      message:
        "We're sorry, but the page you are looking for does not exist :(",
    });

  const spot = await Spot.findByPk(id);

  if (!spot)
    return res.status(404).json({
      message: "Spot couldn't be found",
    });

  if (userId !== spot.ownerId)
    return res.status(403).json({
      message: "Forbidden",
    });

  spot.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

//create new spot - POST api/spots
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const userId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const newSpot = await Spot.create({
    ownerId: userId,
    ...req.body,
  });

  res.status(201).json(newSpot);
});

module.exports = router;
