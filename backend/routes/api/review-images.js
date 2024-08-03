const express = require("express");
const { ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const id = parseInt(req.params.imageId);

  if (!isNaN(id)) {
    const reviewImage = await ReviewImage.findByPk(id);

    if (!reviewImage)
      return res
        .status(404)
        .json({ message: "Review Image couldn't be found" });

    reviewImage.destroy();
    return res.json({ message: "Successfully deleted" });
  }
});

module.exports = router;
