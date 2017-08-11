// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Topic = require('../models/topic');
const Subtopic = require('../models/subtopic');
const Notification = require('../models/notification');


router.post('/addTopic', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const newTopic = new Topic({
    name: req.body.name,
    body: req.body.body,
  });

  const newNotification = new Notification({
    for: 'allUsers',
    link: req.body.notificationLink,
    message: req.body.notificationMessage,
  });

  Topic.addTopic(newTopic, (err, data) => {
    if (err) {
      console.log(`Error in adding new topic
        ${ err }`);
      res.json({
        success: false,
        msg: `ERROR: Something went wrong`,
      });
    } else {
      Notification.addNotification(newNotification, (err, data) => {
        if (err) {
          console.error(`Error adding topic notificatio
            ${err}`);
          res.json({
            success: false,
            msg: "Error adding topic",
          });
        } else {
          res.json({
            success: true,
            msg: "Successfully added topic",
          });
        }
      });
    }
  });
});

router.get('/getAllTopicNames', (req, res, next) => {
  Topic.getAllTopicNames((err, data) => {
    if (err) {
      console.log(`Error in fetching topic names
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/getTopic', (req, res, next) => {
  const topic = {
    name: req.body.name,
  };
  Topic.getTopic(topic, (err, data) => {
    if (err) {
      console.log(`Error in fetching topic
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/editTopic', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  if (req.user.role=="user") {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const topic = {
    id: req.body.id,
    name: req.body.name,
    body: req.body.body,
    modifiedDate: Date.now(),
  };

  Topic.editTopic(topic, (err, data) => {
    if (err) {
      console.log(`Error in editing topic
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
      res.json({
        success: true,
        msg: `Successfully edited topic`,
      });
    }
  });
});

router.post('/deleteTopic', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  if (req.user.role=="user") {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const topic = {
    name: req.body.name,
  };
  Subtopic.deleteSubtopicByTopic(topic.name, (err, data) => {
    if (err) {
      console.error(`Error in deleting subtopics by Topics
        ${ err }`);
        res.json({
          success: false,
          msg: `Something went wrong`,
        });
    } else {
      Topic.deleteTopic(topic, (err, data) => {
        if (err) {
          console.log(`Error in deleting topic
            ${ err }`);
          res.json({
            success: false,
            msg: `Something went wrong`,
          });
        } else {
          res.json({
            success: true,
            msg: `Successfully deleted topic`,
          });
        }
      });
    }
  });
});

module.exports = router;
