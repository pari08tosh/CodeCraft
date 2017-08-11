// jshint esversion: 6, node: true

"use strict";

const mongoose = require('mongoose');

const PlaylistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  topic: {
    type: String,
    required: true,
  },
  subtopic: {
    type: String,
    required: true,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
  videos: [],
});


const Playlist  = module.exports  = mongoose.model('Playlist', PlaylistSchema);

module.exports.addPlaylist = function(newPlaylist, callback) {
  newPlaylist.save(callback);
};

module.exports.addVideo = function(playlist, video, callback) {
  Playlist.findOneAndUpdate({name: playlist.name, topic: playlist.topic, subtopic: playlist.subtopic }, { $push: { videos: video }}).
  exec(callback);
};

module.exports.getPlaylistBySubtopic = function(playlist, callback) {
  Playlist.find({ topic: playlist.topic, subtopic: playlist.subtopic }, callback);
};

module.exports.getPlaylist = function(playlist, callback) {
  Playlist.findOne({ name: playlist.name, subtopic: playlist.subtopic, topic: playlist.topic }, callback);
};

module.exports.editPlaylist = function(playlist, callback) {
  Playlist.findOneAndUpdate({
    _id: playlist.id
  }, {
    $set: {
      name: playlist.name,
      description: playlist.description,
    }
  }).
  exec(callback);
};

module.exports.deleteVideo = function(playlist, video, callback) {
  Playlist.findOneAndUpdate({name: playlist.name, topic: playlist.topic, subtopic: playlist.subtopic }, { $pull: { videos: video }}).
  exec(callback);
};

module.exports.deletePlaylist = function(playlist, callback) {
  Playlist.find({ name: playlist.name, subtopic: playlist.subtopic, topic: playlist.topic }).
  remove(callback);
};
