const express = require("express")
const { Review, Spot, User } = require('../../db/models');
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require('../../utils/auth.js');
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
            .withMessage("Stars must be an integer from 1 to 5"),
]

//Get all Reviews of the current User - GET api/reviews/current
router.get('/current', requireAuth, async (req, res, next) => {
      const reviews = await Review.findAll({

            where: {
                  userId: req.user.id
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
            ]
      })
      const reviewsWithSpot = await Promise.all(reviews.map(async (el) => {
            const spot = await Spot.scope("review").findByPk(
                  el.Spot.id,
                  //TODO find way to exclude virtual data types
                  // { attributes: { excludes: ["numReviews", "avgStarRating", "avgRating"]}}
            );
            return {
                  ...el.dataValues, Spot: spot.dataValues
            }
      }));
      res.json(reviewsWithSpot)
})


module.exports = router;