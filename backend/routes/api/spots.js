const express = require("express");
const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth, checkBooking } = require("../../utils/auth.js");

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

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isAfter(new Date().toString())
    .withMessage("startDate cannot be in the past"),
  check("endDate")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isAfter(check("startDate"))
    .withMessage("endDate cannot be on or before startDate"),
  handleValidationErrors,
];

// const validateImage = [
//   check("url")
//   .exists({ checkFalsy: true })
//   .notEmpty()
//   .withMessage("Must be valid url")
// ];

//GET all spots by current user - GET api/spots/current
router.get("/current", requireAuth, async (req, res, next) => {
  const userId = req.user.id;

  const allSpots = await Spot.scope("user").findAll({
    where: {
      ownerId: userId,
    },
  });

  res.json(allSpots);
});

//POST image by Spot's id - api/spots/:spotId/images
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const id = parseInt(req.params.spotId);
  const userId = req.user.id;

  if (!isNaN(id)) {
    const spot = await Spot.findByPk(id);

    if (!spot)
      return res.status(404).json({ message: "Spot couldn't be found" });

    if (userId === spot.ownerId) {
      //If preview true set current preview to false
      if (req.body.preview) {
        const previewImage = await SpotImage.findOne({
          where: {
            preview: true,
          },
        });
        previewImage.update({
          preview: false,
        });
      }
      const image = await SpotImage.create({ spotId: id, ...req.body });
      return res.status(201).json(image);
    }
    next();
  }
});

//Get all reviews by a spot's id - GET /api/spots/:spotId/reviews
router.get("/:spotId/reviews", async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);

  if (!isNaN(spotId)) {
    const reviews = await Review.findAll({
      where: {
        spotId: spotId,
      },
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

    if (reviews) {
      return res.json(reviews);
    }
  }

  res.status(404).json({
    message: "Spot couldn't be found",
  });
});

//Get all Bookings for a Spot based on the Spot's id - GET /api/spots/:spotId/bookings
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);
  const spot = await Spot.findByPk(spotId);

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

  res.status(404).json({
    message: "Spot couldn't be found",
  });
});

//Create a Booking from a Spot based on the Spot's id - POST api/spots/:spotId/bookings
router.post(
  "/:spotId/bookings",
  requireAuth,
  // checkBooking,
  validateBooking,
  async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const { startDate, endDate } = req.body;

    if (isNaN(spotId))
      return res.status(403).json({ message: "Booking couldn't be found" });
    const spot = await Spot.findByPk(spotId);

    if (!spot)
      return res.status(403).json({ message: "Booking couldn't be found" });

    if (req.user.id === spot.ownerId)
      return res
        .status(403)
        .json({ message: "Can not book spot owned by User" });

    const dateArr = [];
    let date = new Date(startDate);
    while (date <= new Date(endDate)) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getUTCDate();
      dateArr.push(
        new Date(year + "-" + month + "-" + day + " 00:00:00.000 +00:00")
      );
      let newDate = date.setDate(date.getDate() + 1);
      date = new Date(newDate);
    }

    console.log(dateArr);

    let startDouble;
    dateArr.forEach(async (el) => {
      let checkStart = await Booking.findOne({ where: { startDate: el } });
      console.log(checkStart);
      if (checkStart) {
        startDouble = new Error(
          "Start date conflicts with an existing booking"
        );
      }
    });
    console.log("startDouble", startDouble);

    // let endDouble;
    // dateArr.forEach(async el => {
    //   let checkEnd = await Booking.findOne({ where: { endDate: el } })
    //   if (checkEnd) {
    //     endDouble = '"message": "End date conflicts with an existing booking"';
    //   }
    // })
    // console.log(endDouble)

    // if (startDouble || endDouble) {
    //   return res.status(403).json({
    //     "message": "Sorry, this spot is already booked for the specified dates",
    //     "errors": {
    //       startDouble,
    //       endDouble
    //     }
    //   })
    // }

    const newBooking = await Booking.create({
      spotId,
      userId: req.user.id,
      ...req.body,
    });

    res.json(newBooking);
  }
);

//Create a Review for a Spot based on the Spot's id - POST api/spots/:spotId/reviews
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);

    if (!isNaN(spotId)) {
      const spot = await Spot.findByPk(spotId);

      if (spot) {
        const userReviews = await Review.findOne({
          where: {
            userId: req.user.id,
            spotId,
          },
        });

        if (userReviews) {
          return res.status(500).json({
            message: "User already has a review for this spot",
          });
        }
        const newReview = await Review.create({
          userId: req.user.id,
          spotId,
          ...req.body,
        });

        console.log(newReview);

        return res.status(201).json(newReview);
      }
    }

    res.status(404).json({
      message: "Spot couldn't be found",
    });
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
router.get("/", async (req, res) => {
  const spots = await Spot.scope("user").findAll();

  res.json(spots);
});

//Edit a spot - PUT api/spots/:spotId
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  const userId = req.user.id;
  const id = parseInt(req.params.spotId);

  if (!isNaN(id)) {
    const spot = await Spot.findByPk(id);
    if (spot) {
      if (userId === spot.ownerId) {
        const updatedSpot = await spot.update({ ...req.body });
        return res.json(updatedSpot);
      } else {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
    }
  } else {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

//Delete a spot - DELETE api/spots/:spotId
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const id = parseInt(req.params.spotId);

  if (!isNaN(id)) {
    const spot = await Spot.findByPk(id);
    if (spot) {
      if (userId === spot.ownerId) {
        spot.destroy();
        return res.json({
          message: "Successfully deleted",
        });
      } else {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
    }
  } else {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

//create new spot - POST api/spots
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const userId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  // if(!userId){
  //       const err = new Error("Must be logged in to list a spot");
  //       next(err);
  // };

  const newSpot = await Spot.create({
    ownerId: userId,
    ...req.body,
  });

  res.status(201).json(newSpot);
});

module.exports = router;
