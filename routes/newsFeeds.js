// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const NewsFeed = require('../models/newsFeed');
const Notification = require('../models/notification');


router.post('/addFeed', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }
  const newFeed = new NewsFeed({
    heading: req.body.heading,
    body: req.body.body,
  });
  NewsFeed.addFeed(newFeed, (err, data) => {
    if (err) {
      console.error(`Error in adding NewsFeed
        ${err}`);
      res.json({
        success: false,
        msg: `Something went wrong, please try again.`,
      });
    } else {
      res.json({
        success: true,
        msg: `Feed added successfully`,
      });
    }
  });
});

router.get('/getAllFeed',  passport.authenticate('jwt', { session: false }), (req, res, next) => {
  NewsFeed.getAllFeed((err, data) => {
    if (err) {
      console.error(`Error fetching NewsFeeds`);
    } else {
      res.send(data);
    }
  });
});

router.post('/deleteFeed', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }
  NewsFeed.deleteFeed(req.body.id, (err, data) => {
    if (err) {
      console.error(`Error in deleting NewsFeed
        ${err}`);
      res.json({
        success: false,
        msg: `Something went wrong, please try again.`,
      });
    } else {
      res.json({
        success: true,
        msg: `Feed deleted successfully`,
      });
    }
  });
});

module.exports = router;
