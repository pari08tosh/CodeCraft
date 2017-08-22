// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Answer = require('../models/answer');
const Question = require('../models/question');
const Notification = require('../models/notification');


router.post('/getAnswerByQuestion', (req, res, next) => {
  Answer.getAnswerByQuestion(req.body.id, (err, data) => {
    if (err) {
      console.error(` Error in fetching answers for question by id
        err`);
        res.json({
          success: false,
          msg: 'An error occured',
        });
    } else {
      res.json(data);
    }
  });
});

router.post('/getAnswerById', (req, res, next) => {
  Answer.getAnswerById(req.body.id, (err, data) => {
    if (err) {
      console.error(` Error in fetching answers for question by id
        err`);
        res.json({
          success: false,
          msg: 'An error occured',
        });
    } else {
      res.send(data);
    }
  });
});



router.post('/addAnswer', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const newAnswer = new Answer({
    username: req.user.username,
    body: req.body.body,
    questionId: req.body.questionId,
  });

  const newNotification = new Notification({
    for: req.body.notificationFor,
    link: req.body.notificationLink,
    message: `${ req.user.username } answered your question`,
  });
  Answer.insertAnswer(newAnswer, (err, question) => {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        msg: 'Something went wrong please try again.',
      });
    } else {
      Question.addAnswer(newAnswer.questionId, (err, callback) => {
        if (err) {
          console.error(`Error in inc ans value in question
            ${ err }`);
          res.json({
            success: false,
            msg: 'Something went wrong please try again.',
          });
        } else {
          Notification.addNotification(newNotification, (err, callback) => {
            if (err) {
              console.error(`Error in adding ans notification
                ${ err }`);
              res.json({
                success: false,
                msg: 'Something went wrong please try again.',
              });
            } else {
              res.json({
                success: true,
                msg: 'Answer posted successfully',
              });
            }
          });
        }
      });
    }
  });
});

router.post('/editAnswer', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.body.username !== req.user.username && req.user.role !== 'Admin') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const answer = {
    id: req.body.id,
    modifiedDate: Date.now(),
    body: req.body.body,
  };

  Answer.editAnswer(answer, (err, data) => {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Something went wrong",
      });
    } else {
      res.json({
        success: true,
        msg: "Answer edited successfully",
      });
    }
  });
});

router.post('/deleteAnswer', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.body.username !== req.user.username && req.user.role !== 'Admin') {
   return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const answerId = req.body.id;
  Answer.deleteAnswer(answerId, (err, data) => {
    if (err) {
      console.log(`Error in deleting Answer ${ answerId } ---
        ${err}`);
      res.json({
        success: false,
        msg: "Something went wrong",
      });
    } else {
      res.json({
        success: true,
        msg: "Answer deleted successfully",
      });
    }
  });
});


module.exports = router;
