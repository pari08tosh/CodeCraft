// jshint esversion: 6, node: true

"use strict";

const mongoose = require('mongoose');

const NewsFeedSchema = mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const NewsFeed = module.exports = mongoose.model('NewsFeed', NewsFeedSchema);

module.exports.addFeed = function(newFeed, callback) {
  newFeed.save(callback);
};

module.exports.getAllFeed = function(callback) {
  NewsFeed.
  find().
  sort('-date').
  limit(10).
  exec(callback);
};

module.exports.deleteFeed = function(feedId, callback) {
  NewsFeed.
  find({_id: feedId}).
  remove(callback);
};
