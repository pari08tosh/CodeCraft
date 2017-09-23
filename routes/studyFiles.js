// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/database');
const serverConfig = require('../config/server');
const StudyFile = require('../models/studyFile');
const Subtopic = require('../models/subtopic');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Notification = require('../models/notification');



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if(serverConfig.productionMode){
      cb(null, 'public/assets/studyFiles');
    } else {
      cb(null, 'angular-src/src/assets/studyFiles');
    }
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage
});

const fileUpload = upload.fields([{
    name: 'file',
    maxCount: 1
  },
]);


router.post('/addStudyFile', fileUpload, (req, res, next) => {
  const newStudyFile = new StudyFile({
    name: req.body.name,
    subtopic: req.body.subtopic,
    topic: req.body.topic,
    fileLink: req.files['file'][0].filename,
  });

  StudyFile.addStudyFile(newStudyFile, (err, data) => {
    if (err) {
      console.log(`Error in adding study file
      ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
        if(serverConfig.productionMode){
          res.redirect(`/learn/${ newStudyFile.topic }/${ newStudyFile.subtopic }`);
        } else {
          res.json({
            success: true,
            msg: `Study File uploaded Successfully`,
          });
        }
    }
  });
});

router.post('/getStudyFilesForContent', (req, res, next) => {
  const file = {
    subtopic: req.body.subtopic,
    topic: req.body.topic,
  };
  StudyFile.getStudyFilesForContent(file, (err, data) => {
    if (err) {
      console.log(`Error in fetching Study File
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/deleteStudyFile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role == "user") {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const file = {
    id: req.body.id,
  };

  StudyFile.getStudyFileById(file.id, (err, data) => {
    if (err) {
      console.error(`Error in deleting study file in folder
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
      if(serverConfig.productionMode) {
        fs.unlinkSync('public/assets/studyFiles'+'/'+data.fileLink);
      }
      StudyFile.deleteStudyFile(file, (err, data) => {
        if (err) {
          console.log(`Error in deleting Study file
            ${ err }`);
          res.json({
            success: false,
            msg: `Something went wrong`,
          });
        } else {
          res.json({
            success: true,
            msg: `File deleted Successfully`,
          });
        }
      });
    }
  });
});

module.exports = router;
