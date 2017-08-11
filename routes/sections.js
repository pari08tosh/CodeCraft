// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Section = require('../models/section');
const Subtopic = require('../models/subtopic');
const Notification = require('../models/notification');


router.post('/addSection', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const newSection = new Section({
    name: req.body.name,
    body: req.body.body,
    subtopic: req.body.subtopic,
    topic: req.body.topic,
  });

  const newNotification = new Notification({
    for: 'allUsers',
    link: req.body.notificationLink,
    message: req.body.notificationMessage,
  });

  Section.addSection(newSection, (err, data) => {
    if (err) {
      console.log(`Error in adding new section
        ${ err }`);
      res.json({
        success: false,
        msg: `ERROR: Something went wrong`,
      });
    } else {
      Notification.addNotification(newNotification, (err, data) => {
        if (err) {
          console.error(`Error adding section notification
            ${err}`);
          res.json({
            success: false,
            msg: "Error adding section",
          });
        } else {
          res.json({
            success: true,
            msg: "Successfully added section",
          });
        }
      });
    }
  });
});

router.post('/getAllSectionForSubtopic', (req, res, next) => {
  const subtopic = {
    topic: req.body.topic,
    name: req.body.name,
  };

  Section.getAllSectionForSubtopic(subtopic, (err, data) => {
    if (err) {
      console.log(`Error in fetching section names
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/getSection', (req, res, next) => {
  const section = {
    topic: req.body.topic,
    subtopic: req.body.subtopic,
    name: req.body.name,
  };
  Section.getSection(section, (err, data) => {
    if (err) {
      console.log(`Error in fetching section
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/editSection', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const section = {
    id: req.body.id,
    name: req.body.name,
    body: req.body.body,
    modifiedDate: Date.now(),
  };
  Section.editSection(section, (err, data) => {
    if (err) {
      console.log(`Error in editing section
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
      res.json({
        success: true,
        msg: `Successfully edited section`,
      });
    }
  });
});

router.post('/deleteSection',passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const section = {
    topic: req.body.topic,
    name: req.body.name,
    subtopic: req.body.subtopic,
  };

  Section.deleteSection(section, (err, data) => {
    if (err) {
      console.log(`Error in deleting section
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
      res.json({
        success: true,
        msg: `Successfully deleted section`,
      });
    }
  });
});

module.exports = router;
