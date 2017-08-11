// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/database');
const serverConfig = require('../config/server');
const Ebook = require('../models/ebook');
const Subtopic = require('../models/subtopic');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Notification = require('../models/notification');



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if(serverConfig.productionMode){
      cb(null, 'public/assets/ebooks');
    } else {
      cb(null, 'angular-src/src/assets/ebooks');
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
    name: 'ebook',
    maxCount: 1
  },
  {
    name: 'image',
    maxCount: 1
  },
]);


router.post('/addEbook', fileUpload, (req, res, next) => {
  const newEbook = new Ebook({
    name: req.body.name,
    body: req.body.body,
    subtopic: req.body.subtopic,
    topic: req.body.topic,
    ebookLink: req.files['ebook'][0].filename,
    imageLink: req.files['image'][0].filename,
  });

  Ebook.addEbook(newEbook, (err, data) => {
    if (err) {
      console.log(`Error in adding ebook
      ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
        if(serverConfig.productionMode){
          res.redirect(`/learn/${ newEbook.topic }/${ newEbook.subtopic }`);
        } else {
          res.json({
            success: true,
            msg: `Ebook uploaded Successfully`,
          });
        }
    }
  });
});

router.post('/getEbooksForContent', (req, res, next) => {
  const ebook = {
    subtopic: req.body.subtopic,
    topic: req.body.topic,
  };
  Ebook.getEbooksForContent(ebook, (err, data) => {
    if (err) {
      console.log(`Error in fetching Ebook
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/deleteEbook', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  if (req.user.role == "user") {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  }

  const ebook = {
    id: req.body.id,
  };

  Ebook.getEbookById(ebook.id, (err, data) => {
    if (err) {
      console.error(`Error in deleting ebooks in folder
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
      if(serverConfig.productionMode) {
        fs.unlinkSync('public/assets/ebooks'+'/'+data.ebookLink);
        fs.unlinkSync('public/assets/ebooks'+'/'+data.imageLink);
      }
      Ebook.deleteEbook(ebook, (err, data) => {
        if (err) {
          console.log(`Error in deleting Ebook
            ${ err }`);
          res.json({
            success: false,
            msg: `Something went wrong`,
          });
        } else {
          res.json({
            success: true,
            msg: `Ebook deleted Successfully`,
          });
        }
      });
    }
  });
});

module.exports = router;
