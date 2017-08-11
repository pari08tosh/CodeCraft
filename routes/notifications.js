// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Notification = require('../models/notification');


router.post('/addAdminNotification', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.json({
        success: false,
        msg: 'You are not authorized',
      });
  }

  const newNotification = new Notification({
    for: 'allUsers',
    message: req.body.message,
    link: req.body.link,
  });

  Notification.addNotification(newNotification, (err, data) => {
    if (err) {
      console.error(`Error in adding admin Notification
        ${ err }`);
      res.json({
        success: false,
        msg: 'Something went wrong',
      });
    } else {
      res.json({
        success: true,
        msg: 'Notification posted Successfully',
      });
    }
  });
});

router.post('/getUnreadNotifications', (req, res, next) => {
  Notification.getUnreadNotificationByUsername(req.body.username, (err, data) => {
    if (err) {
      console.error(`Error in fetching user unread Notification
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong, could not get your notifications`,
      });
    } else {
      res.send(data);
    }
  });
});

router.post('/markAsRead', (req, res, next) => {
  const data = {
    notificationId: req.body.notificationId,
    username: req.body.username,
  };

  Notification.markAsRead(data, (err, data) => {
    if (err) {
      console.error(`Error in marking notificaion as read
        ${err}`);
        res.json({
          success: false,
          msg: `Something went wrong`,
        });
    } else {
      res.json({
        success: true,
        msg: 'Notification read Successfully',
      });
    }
  });

});

module.exports = router;
