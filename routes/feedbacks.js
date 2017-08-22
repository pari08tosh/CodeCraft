// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Feedback = require('../models/feedback');
const Notification = require('../models/notification');


router.post('/addFeedback', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const newFeedback = new Feedback({
    body: req.body.body,
    username: req.user.username,
    subject: req.body.subject,
  });

  Feedback.addFeedback(newFeedback, (err, data) => {
    if (err) {
      console.error(`Error in adding Feedback
        ${err}`);
      res.json({
        success: false,
        msg: `Something went wrong, please try again.`,
      });
    } else {
      console.log(`**New Feedback**`);
      res.json({
        success: true,
        msg: `Thank you for your message. We will look into it shortly`,
      });
    }
  });
});

router.get('/getAllFeedback', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  } else {
    Feedback.getAllFeedback((err, data) => {
      if (err) {
        console.error(`Error fetching feedbacks`);
      } else {
        res.send(data);
      }
    });
  }
});

router.post('/replyToFeedback', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  } else {
    const newNotification = new Notification({
      for: req.body.username,
      message: 'The Admin replied to your feedback',
      link: '/feedback',
    });
    Notification.addNotification(newNotification, (err, data) => {
      if (err) {
        console.error(`Error in generating notification for feedback reply
          ${err}`);
          res.json({
            success: false,
            msg: `Something went wrong, please try again.`,
          });
      } else {
        const newReply = {
          id: req.body.id,
          message: req.body.message,
        };
        Feedback.replyToFeedback(newReply, (err, data) => {
          if (err) {
            console.error(`Error in replying to feedback`);
            res.json({
              success: false,
              msg: `Something went wrong, please try again`,
            });
          } else {
            res.json({
              success: true,
              msg: `Successfully replied to feedback`,
            });
          }
        });
      }
    });
  }
});

router.get('/getFeedbackByUsername', passport.authenticate('jwt', { session: false }), (req, res, body) => {
  Feedback.getFeedbackByUsername(req.user.username, (err, data) => {
    if (err) {
      console.error(`Error in fetching user feedbacks
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
