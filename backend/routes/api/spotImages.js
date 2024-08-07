const express = require("express");
const { SpotImage, Spot } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");

const router = express.Router();

//Delete a Spot Image - DELETE api/spot-images/:imageId
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const id = parseInt(req.params.imageId);

  if (isNaN(id))
    return res.status(404).json({
      message: "We're sorry, the page you are looking for does not exist :(",
    });

  const image = await SpotImage.findByPk(id);

  if (!image)
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });

  const { spotId } = image.dataValues;

  const spot = await Spot.findOne({
    where: {
      id: spotId
    }
  })

  if (!spot) return res.status(404).json({ message: "Something is broken" })

  const { ownerId } = spot.dataValues;

  if (userId !== ownerId)
    return res.status(403).json({
      message: "Forbidden",
    });

  image.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
