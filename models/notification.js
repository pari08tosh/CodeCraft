// jshint esversion: 6, node: true

"use strict";

const mongoose = require('mongoose');


const NotificationSchema = mongoose.Schema({

  for: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    expires: 2592000,
    default: Date.now,
  },

  readBy: {
    type: [],
    default: [],
  }

});

const Notification = module.exports = mongoose.model('Notification', NotificationSchema);

module.exports.addNotification = function(newNotification, callback) {
  newNotification.save(callback);
};

module.exports.getUnreadNotificationByUsername = function(username, callback) {
  Notification.find({ $and: [
    { $or: [ { for: username }, { for: 'allUsers' } ] },
    { readBy: { $ne: username } },
  ]}).
  sort('-date').
  limit(5).
  exec(callback);
};

module.exports.getAllNotificationsByUsername = function(username, callback) {
  Notification.find({ $or: [
    { for: username },
    { for: 'allUsers' },
  ]}).
  sort('-date').
  exec(callback);
};

module.exports.markAsRead = function(data, callback) {
  Notification.update({ _id: data.notificationId }, { $push: { readBy: data.username }}).
  exec(callback);
};
