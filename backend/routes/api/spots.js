const express = require("express");
const { requireAuth, checkDate } = require("../../utils/auth.js");
const {
  getAllSpots,
  getOwnedSpots,
  getASpot,
  createASpot,
  editASpot,
  addSpotImage,
  deleteASpot,
  getSpotReviews,
  getSpotBookings,
  addSpotBooking,
  addSpotReview,
  checkBookings,
  validateReview,
  validateParams,
  validateSpot,
} = require("../utils/spots-router-logic.js");

const router = express.Router();

// Get Owner's Spots - URL: api/spots/current
router.get("/current", requireAuth, getOwnedSpots);

// Create Spot Image - URL: api/spots/:spotId/images
router.post("/:spotId/images", requireAuth, addSpotImage);

//Get a Spot's Reviews - URL: /api/spots/:spotId/reviews
router.get("/:spotId/reviews", getSpotReviews);

//Get all Spot's Bookings - URL: /api/spots/:spotId/bookings
router.get("/:spotId/bookings", requireAuth, getSpotBookings);

//Create a Spot Booking - URL: api/spots/:spotId/bookings
router.post(
  "/:spotId/bookings",
  requireAuth,
  checkDate,
  checkBookings,
  addSpotBooking
);

//Create a Spot Review - URL: api/spots/:spotId/reviews
router.post("/:spotId/reviews", requireAuth, validateReview, addSpotReview);

//Get a Spot - URL: api/spots/:spotId
router.get("/:spotId", getASpot);

//Get all Spots - URL: api/spots
router.get("/", validateParams, getAllSpots);

//Edit a Spot - URL: api/spots/:spotId
router.put("/:spotId", requireAuth, validateSpot, editASpot);

//Delete a Spot - URL: api/spots/:spotId
router.delete("/:spotId", requireAuth, deleteASpot);

//Create a Spot - URL: api/spots
router.post("/", requireAuth, validateSpot, createASpot);

module.exports = router;
