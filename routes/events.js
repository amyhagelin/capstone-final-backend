const express = require('express');
const router = express.Router();
const Event = require('../models/event');

router.get('/', (req, res) => {
  // TODO: find by user, connect to front endç
  console.log(req.headers)
  Event.find({ userId: req.decoded._id }).then((result) => {
    console.log(result)
    res.json(result)
  })
});

router.post('/', (req, res) => {

    const { date, time, type, triggers, location, medication, notes } = req.body;
    const event = new Event({
      date,
      time,
      type,
      triggers,
      location,
      medication,
      notes,
      userId: req.decoded._id
    });

    event.save((err, result) => {
      if (err) {
        console.error(err);
        res.send('error');
      }
      console.log(result);
      res.send(result);
    })

    // console.log(req.body);
});

module.exports = router;