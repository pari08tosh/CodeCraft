//jshint esversion:6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const serverConfig = require('../config/server');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (serverConfig.productionMode) {
      cb(null, 'public/assets/images/contentImages');
    } else {
      cb(null, 'angular-src/src/assets/images/contentImages');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

 const fileUpload = upload.fields([
  { name: 'file', maxCount: 1 },
]);

router.post('/', fileUpload, (req, res, next) => {
  console.log('/assets/images/contentImages/' + req.files['file'][0].filename);
  res.json({
    location: '/assets/images/contentImages/' + req.files['file'][0].filename,
  });
});

module.exports = router;
