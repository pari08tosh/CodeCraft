// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Subtopic = require('../models/subtopic');
const Topic = require('../models/topic');
const Section = require('../models/section');
const Notification = require('../models/notification');


router.post('/addSubtopic', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const newSubtopic = new Subtopic({
    name: req.body.name,
    body: req.body.body,
    topic: req.body.topic,
  });

  const newNotification = new Notification({
    for: 'allUsers',
    link: req.body.notificationLink,
    message: req.body.notificationMessage,
  });

  Subtopic.addSubtopic(newSubtopic, (err, data) => {
    if (err) {
      console.log(`Error in adding new Subtopic
        ${ err }`);
      res.json({
        success: false,
        msg: `ERROR: Something went wrong`,
      });
    } else {
      Notification.addNotification(newNotification, (err, data) => {
        if (err) {
          console.error(`Error adding subtopic notification
            ${err}`);
              res.json({
            success: false,
            msg: "Error adding subtopic",
          });
        } else {
          res.json({
            success: true,
            msg: "Successfully added subtopic",
          });
        }
      });
    }
  });
});

router.post('/getAllSubtopicForTopic', (req, res, next) => {
  const topic = {
    name: req.body.name,
  };

  Subtopic.getAllSubtopicForTopic(topic, (err, data) => {
    if (err) {
      console.log(`Error in fetching Subtopic names
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/getSubtopic', (req, res, next) => {
  const subtopic = {
    topic: req.body.topic,
    name: req.body.name,
  };
  Subtopic.getSubtopic(subtopic, (err, data) => {
    if (err) {
      console.log(`Error in fetching Subtopic
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/editSubtopic', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }
  const subtopic = {
    id: req.body.id,
    name: req.body.name,
    body: req.body.body,
    modifiedDate: Date.now(),
  };

  Subtopic.editSubtopic(subtopic, (err, data) => {
    if (err) {
      console.log(`Error in editing Subtopic
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
      res.json({
        success: true,
        msg: `Successfully edited Subtopic`,
      });
    }
  });
});

router.post('/deleteSubtopic', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const subtopic = {
    name: req.body.name,
    topic: req.body.topic,
  };

  Section.deleteSectionBySubtopic(subtopic.name, subtopic.topic, (err, data) => {
    if (err) {
      console.error(`Error deleting section by subtopic
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
      Subtopic.deleteSubtopic(subtopic, (err, data) => {
        if (err) {
          console.log(`Error in deleting Subtopic
            ${ err }`);
          res.json({
            success: false,
            msg: `Something went wrong`,
          });
        } else {
          res.json({
            success: true,
            msg: `Successfully deleted Subtopic`,
          });
        }
      });
    }
  });
});

module.exports = router;
