// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/database');
const serverConfig = require('../config/server');
const Playlist = require('../models/playlist');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Notification = require('../models/notification');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if(serverConfig.productionMode) {
      cb(null, 'public/assets/videos');
    } else {
      cb(null, 'angular-src/src/assets/videos');
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
  name: 'video',
  maxCount: 1
}, ]);

router.post('/addPlaylist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin' && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  } else {
    const playlist = new Playlist({
      name: req.body.name,
      topic: req.body.topic,
      subtopic: req.body.subtopic,
      description: req.body.description,
    });
    Playlist.addPlaylist(playlist, (err, data) => {
      if (err) {
        console.error(`Error adding playlist
          ${ err }`);
        res.json({
          success: false,
          msg: `Something went wrong`,
        });
      } else {
        res.json({
          success: true,
          msg: `Successfully added playlist`,
        });
      }
    });
  }
});


router.post('/addVideo', fileUpload, (req, res, next) => {
  const video = {
    name: req.body.name,
    fileName: req.files['video'][0].filename,
  };

  const playlist = {
    name: req.body.playlist,
    topic: req.body.topic,
    subtopic: req.body.subtopic,
  };

  Playlist.addVideo(playlist, video, (err, data) => {
    if (err) {
      console.error(`Error adding video
        ${ err }`);
      res.json({
        success: false,
        msg: `Something went wrong`,
      });
    } else {
      if (serverConfig.productionMode) {
        res.redirect(`/learn/${ playlist.topic }/${ playlist.subtopic }`);
      } else {
        res.json({
          success: true,
          msg: `Successfully added video`,
        });
      }
    }
  });
});


router.post('/getPlaylistBySubtopic', (req, res, data) => {
  const playlist = {
    topic: req.body.topic,
    subtopic: req.body.subtopic,
  };

  Playlist.getPlaylistBySubtopic(playlist, (err, data) => {
    if (err) {
      console.error(`Error fetching playlists by subtopic
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/getPlaylist', (req, res, next) => {
  const playlist = {
    name: req.body.name,
    topic: req.body.topic,
    subtopic: req.body.subtopic,
  };

  Playlist.getPlaylist(playlist, (err, data) => {
    if (err) {
      console.error(`Error fetching playlist
        ${err}`);
    } else {
      res.send(data);
    }
  });
});

router.post('/editPlaylist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin' && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  } else {
    const playlist = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
    };

    Playlist.editPlaylist(playlist, (err, data) => {
      if (err) {
        console.error(`Error editing playlist
          ${ err }`);
        res.json({
          success: false,
          msg: `Something went wrong`,
        });
      } else {
        res.json({
          success: true,
          msg: `Successfully updated playlist`,
        });
      }
    });
  }
});

router.post('/deleteVideo', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin' && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  } else {
    const playlist = {
      topic: req.body.topic,
      subtopic: req.body.subtopic,
      name: req.body.playlist,
    };

    const video = {
      name: req.body.name,
      fileName: req.body.fileName,
    };

    if(serverConfig.productionMode) {
      fs.unlinkSync('public/assets/videos'+'/'+video.fileName);
    }
    Playlist.deleteVideo(playlist, video, (err, data) => {
      if (err) {
        console.error(`Error deleting video
          ${ err }`);
        res.json({
          success: false,
          msg: `Something went wrong`,
        });
      } else {
        res.json({
          success: true,
          msg: `Successfully deleted video`,
        });
      }
    });
  }
});

router.post('/deletePlaylist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin' && req.user.role !== 'Content Manager') {
    return res.json({
      success: false,
      msg: `You are not authorized`,
    });
  } else {
    const playlist = {
      topic: req.body.topic,
      subtopic: req.body.subtopic,
      name: req.body.playlist,
    };

    Playlist.getPlaylist(playlist, (err, data) => {
      if (err) {
        console.error(`Error retreiving playlist
          ${err}`);
          res.json({
            success: false,
            msg: `Something went wrong`,
          });
      } else {
        if (serverConfig.productionMode) {
          data.videos.forEach(video => {
            fs.unlinkSync('public/assets/videos'+'/'+video.fileName);
          });
        }
        Playlist.deletePlaylist(playlist, (err, data) => {
          if (err) {
            console.error(`Error deleting playlist
              ${ err }`);
            res.json({
              success: false,
              msg: `Something went wrong`,
            });
          } else {
            res.json({
              success: true,
              msg: `Successfully deleted playlist`,
            });
          }
        });
      }
    });
  }
});


module.exports = router;
