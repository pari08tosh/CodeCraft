// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Source = require('../models/source');
const Notification = require('../models/notification');


router.post('/addSource', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin' && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }
  const newSource = new Source({
    name: req.body.name,
    link: req.body.link,
  });
  Source.addSource(newSource, (err, data) => {
    if (err) {
      console.error(`Error in adding source
        ${err}`);
      res.json({
        success: false,
        msg: `Something went wrong, please try again.`,
      });
    } else {
      res.json({
        success: true,
        msg: `Source added successfully`,
      });
    }
  });
});

router.get('/getAllSource', (req, res, next) => {
  Source.getAllSource((err, data) => {
    if (err) {
      console.error(`Error fetching sources`);
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
