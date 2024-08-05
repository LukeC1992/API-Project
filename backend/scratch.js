router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId)
  const { startDate, endDate } = req.body;

  if (isNaN(spotId)) return res.status(403).json({ "message": "Booking couldn't be found" });
  const spot = await Spot.findByPk(spotId);

  if (!spot) return res.status(403).json({ "message": "Booking couldn't be found" });

  if (req.user.id === spot.ownerId) return res.status(403).json({ "message": "Can not book spot owned by User" });

  const dateArr = []
  let date = new Date(startDate);
  while (date <= new Date(endDate)) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getUTCDate();
    dateArr.push(year + "-" + month + "-" + day);
    let newDate = date.setDate(date.getDate() + 1);
    date = new Date(newDate);
  }

  console.log(dateArr);

  let startDouble = dateArr.some(async el => {
    checkStart = await Booking.findAll({ where: { startDate: el } })
  });

  let endDouble = dateArr.some(async el => {
    checkEnd = await Booking.findAll({ where: { endDate: el } })
  });

  if (startDouble && endDouble) {
    return res.status(403).json({
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    })
  }

  if (startDouble) {
    return res.status(403).json({
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking"
      }
    })
  }

  if (startDouble && endDouble) {
    return res.status(403).json({
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    })
  }

  const newBooking = await Booking.create({ spotId, userId: req.user.id, ...req.body });

  res.json(newBooking);