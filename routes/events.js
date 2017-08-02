const express = require('express');
const router = express.Router();
const Event = require('../models/event');

router.get('/', (req, res) => {
  Event.find({ userId: req.decoded._doc._id }).then((result) => {
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
      userId: req.decoded._doc._id
    });

    event.save((err, result) => {
      if (err) {
        console.error(err);
        res.send('error');
      }
      console.log(result);
      res.send(result);
    })
    // console log to e sure we've hit route
    // console.log(req.body);
});

module.exports = router;