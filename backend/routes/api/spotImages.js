const express = require("express");
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');

const router = express.Router();

//Delete a Spot Image - DELETE api/spot-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res, next) => {
      const userId = req.user.id;
      const id = parseInt(req.params.imageId);

      if (typeof id === 'number' && !isNaN(id)) {
            const picture = await SpotImage.findByPk(id)
            const spot = await picture.getSpot();
            ownerId = spot.dataValues.ownerId;

            if (!picture) return res.status(404).json({
                  "message": "Spot Image couldn't be found"
            })
            if(userId===ownerId){
                  picture.destroy();
                  return res.json({
                        "message": "Successfully deleted"
                  })
            } else {
                  return res.status(403).json({
                        "message": "Forbidden"
                  })
            }
      }
      next();
})

module.exports = router;