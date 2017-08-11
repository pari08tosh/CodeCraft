// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Code = require('../models/code');
const request = require('request');
const serverConfig = require('../config/server');

router.post('/submitCode', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  request.post({
    url:`http://localhost:${ serverConfig.judgePort }/runCode`,
    form: {
      language: req.body.language,
      code: req.body.body,
      testString: req.body.userInput,
     }
  }, (err, httpResponse, body) => {
    if (err) {
      console.log(`Error in running code on judge`);
      res.json({
        success: false,
        output: `An error occured, please try again`,
      });
    } else {
      if (JSON.parse(body).success && req.body.save) {
        const newCode = new Code({
          title: req.body.title,
          body: req.body.body,
          privacy: req.body.privacy,
          username: req.user.username,
          language: req.body.language,
        });

        Code.addCode(newCode, (err, data) => {
          if (err) {
            console.log(`Error submiting code to judge
              ${err}`);
            res.json({
              success: false,
              msg: `An error occured, please try again`,
            });
          } else {
            res.send(body);
          }
        });
      } else {
        res.send(body);
      }
    }
  });
});

router.get('/getRecentSubmissions', (req, res, next) => {
  Code.getRecentSubmissions((err, data) => {
    if (err) {
      console.error(`Error fetching recent submissions
        ${ err }`);
    } else {
      res.send(data);
    }
  });
});

router.get('/getUserSubmissions', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Code.getUserSubmissions(req.user.username, (err, data) => {
    if (err) {
      console.error(`Erorr fetching user submissions
        ${ err }`);
    } else {
      res.send(data);
    }
  });
});

router.post('/getSubmissionById', (req, res, next) => {
  Code.getSubmissionById(req.body.id, (err, data) => {
    if (err) {
      console.error(`Error fetching sibmission by id
        ${ err }`);
    } else {
      res.send(data);
    }
  });
});

router.post('/searchCodes', (req, res, next) => {
  const searchObj = {
    searchString: req.body.searchString,
    pn: req.body.pn,
  };
  Code.searchCodes(searchObj, (err, data) => {
    if (err) {
      console.error(`Error searching people
        ${ err }`);
    } else {
      res.send(data);
    }
  });
});

router.post('/countCodes', (req, res, next) => {
  const searchObj = {
    searchString: req.body.searchString,
  };
  Code.countCodes(searchObj, (err, data) => {
    if (err) {
      console.log(`Error counting users
        ${err}`);
    } else {
      res.json({
        success: true,
        count: data,
      });
    }
  });
});

router.post('/deleteCode', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Code.getSubmissionById(req.body.id, (err, data) => {
    if (err) {
      console.error(`Error feching submission to delete
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong, please try again`,
      });
    } else {
      if (data.username !== req.user.username) {
        res.json({
          success: false,
          msg: `You are not authorized`,
        });
      } else {
        Code.deleteCode(req.body.id, (err, data) => {
          if (err) {
            console.log(`Error deleting submission`);
            res.json({
              success: false,
              msg: `Something went wrong, please try again`,
            });
          } else {
            res.json({
              success: true,
              msg: `Code deleted successfully`,
            });
          }
        });
      }
    }
  });
});


module.exports = router;
