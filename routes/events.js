const express = require('express');
const router = express.Router();
const Event = require('../models/event');

router.post('/', (req, res) => {
    const { date, time, type, triggers, location, medication, notes } = req.body;
    const event = new Event({
      date,
      time,
      type,
      triggers,
      location,
      medication,
      notes
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