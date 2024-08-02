const express = require("express");
const router = express.Router();
const { Spot } = require('../../db/models')

router.get('/', async (req, res) => {
      const spots = await Spot.unscoped().findAll();

      res.json(spots)
})

module.exports = router