// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Question = require('../models/question');
const Answer = require('../models/answer');

router.post('/', (req, res, next) => {
  const pageNumber = req.body.pn;
  const tag = req.body.tag;
  Question.getQuestions(pageNumber, tag, (err, data) => {
    if (err) {
      console.error(` Error in fetching Questions
        ${err}`);
        res.json({
          success: false,
          msg: 'An error occured',
        });
    } else {
      res.send(data);
    }
  });
});

router.post('/countQuestions', (req, res, next) => {
  const questionObj = {
    tag: req.body.tag,
    searchString: req.body.searchString,
  };

  Question.countQuestions(questionObj, (err, data) => {
    if (err) {
      console.error(` Error in fetching count of Questions
        ${err}`);
        res.json({
          success: false,
          msg: 'An error occured',
        });
    } else {
      res.json({
        success: true,
        count: data,
      });
    }
  });
});

router.post('/searchQuestions', (req, res, next) => {
  const searchObj = {
    pn: req.body.pn,
    searchString: req.body.searchString,
  };
  Question.searchQuestion(searchObj, (err, data) => {
    if (err) {
      console.log(`error in searching data ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/getQuestionById', (req, res, next) => {
  Question.getQuestionById(req.body.id, (err, data) => {
    if (err) {
      console.error(` Error in fetching Questions by id
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

router.post('/getQuestionByUsername', (req, res, next) => {
  Question.getQuestionByUsername(req.body.username, (err, data) => {
    if (err) {
      console.error(` Error in fetching Questions by username
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

router.post('/addQuestion', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const newQuestion = new Question({
    username: req.user.username,
    tags: req.body.tags,
    question: req.body.question,
  });
  Question.insertQuestion(newQuestion, (err, question) => {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        msg: 'Something went wrong please try again.',
      });
    } else {
      res.json({
        success: true,
        msg: 'Question posted successfully.',
      });
    }
  });
});

router.post('/editQuestion', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  Question.getQuestionById(req.body.id, (err, data) => {
    if (err) {
      return res.json({
        success: false,
        msg: "Something went wrong",
      });
    } else {
      if (data.username !== req.user.username) {
        return res.json({
          success: false,
          msg: "Unauthorized",
        });
      }

      const question = {
        id: req.body.id,
        question: req.body.question,
        tags: req.body.tags,
        modifiedDate: Date.now(),
      };

      Question.editQuestion(question, (err, data) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            msg: "Something went wrong",
          });
        } else {
          res.json({
            success: true,
            msg: "Question edited successfully",
          });
        }
      });
    }
  });
});

router.post('/deleteQuestion', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const questionId = req.body.id;

  Question.getQuestionById(questionId, (err, data) => {
    if (err) {
      return res.json({
        success: false,
        msg: "Something went wrong",
      });
    } else {
      if (data.username !== req.user.username) {
        return res.json({
          success: false,
          msg: "Unauthorized",
        });
      }

      Question.deleteQuestion(questionId, (err, data) => {
        if (err) {
          console.log(`Error in deleting Question ${ questionId } ---
            ${err}`);
        } else {
          Answer.deleteAnswerByQuestion(questionId, (err, data) => {
            if (err) {
              console.log(`Error in deleting Answer by question ${ questionId } ---
                ${err}`);
              res.json({
                success: false,
                msg: "Something went wrong",
              });
            } else {
              res.json({
                success: true,
                msg: "Question deleted successfully",
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
