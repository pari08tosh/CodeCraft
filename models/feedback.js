// jshint esversion: 6, node: true

"use strict";

const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    default: 'No Reply',
  },
  date: {
    type: Date,
    expires: 2592000,
    default: Date.now,
  }
});

const Feedback = module.exports = mongoose.model('Feedback', FeedbackSchema);

module.exports.addFeedback = function(newFeedback, callback) {
  newFeedback.save(callback);
};

module.exports.getAllFeedback = function(callback) {
  Feedback.
  find().
  sort('-date').
  exec(callback);
};

module.exports.getFeedbackByUsername = function(username, callback) {
  Feedback.find({ username: username }).
  sort('-date').
  exec(callback);
};

module.exports.replyToFeedback = function(feedback, callback) {
  Feedback.update({ _id: feedback.id }, { $set: { reply: feedback.message }}, callback);
};
