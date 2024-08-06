const express = require("express");
const { Review, Spot, User, ReviewImage } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");

const router = express.Router();

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

// const validateImage = [
//   check("url")
//   .exists({checkFalsy: true})
//   .notEmpty()
//   .isURL()
//   .withMessage("Must be a valid url")
// ]

//Delete a review - DELETE /api/reviews/:reviewId
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const id = parseInt(req.params.reviewId);

  if (!isNaN(id)) {
    const review = await Review.findByPk(id);

    if (review) {
      review.destroy();

      return res.json({
        message: "Successfully deleted",
      });
    }
  }

  res.status(404).json({
    message: "Review couldn't be found",
  });
});

//Add an Image to a Review based on the Review's id - POST api/reviews/:reviewId/images
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);

  if (!isNaN(reviewId)) {
    const review = await Review.findByPk(reviewId);
    if (!review)
      return res.status(404).json({ message: "Review couldn't be found" });

    const numImages = await ReviewImage.count({
      where: {
        reviewId,
      },
    });

    if (numImages > 9) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached",
      });
    }
    const newImage = await ReviewImage.scope("defaultScope").create({
      reviewId,
      ...req.body,
    });

    //TODO scope the newly created image for res

    return res.status(201).json(newImage);
  }
});

//Edit a review - PUT /api/review/:reviewId
router.put(
  "/:reviewId",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const id = parseInt(req.params.reviewId);

    if (!isNaN(id)) {
      const review = await Review.findByPk(id);

      if (review) {
        const updatedReview = await review.update({ ...req.body });

        return res.json(updatedReview);
      }
    }

    res.status(404).json({
      message: "Review couldn't be found",
    });
  }
);

//Get all Reviews of the current User - GET api/reviews/current
router.get("/current", requireAuth, async (req, res, next) => {
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User.scope("owner"),
        require: true,
      },
      {
        model: Spot.scope("review"),
        require: true,
      },
      {
        model: ReviewImage.scope("defaultScope"),
        require: true,
      },
    ],
  });
  const reviewsWithSpot = await Promise.all(
    reviews.map(async (el) => {
      const spot = await Spot.scope("review").findByPk(el.Spot.id);
      return {
        Reviews: [
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
  res.json(reviewsWithSpot[0]);
});

module.exports = router;
