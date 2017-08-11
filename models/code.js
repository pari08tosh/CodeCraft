// jshint esversion: 6, node: true

"use strict";

const mongoose = require('mongoose');
const config = require("../config/database");

const CodeSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  privacy: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Code = module.exports = mongoose.model('Code', CodeSchema);

module.exports.addCode = function(newCode, callback) {
  newCode.save(callback);
};

module.exports.getCode = function(id, callback) {
  Code.findById(id, callback);
};

module.exports.getRecentSubmissions = function(callback) {
  Code.
  find({privacy: "public"}).
  sort("-date").
  limit(5).
  select('username language date title').
  exec(callback);
};

module.exports.getSubmissionById = function(id, callback) {
  Code.findById(id, callback);
};

module.exports.getUserSubmissions = function(username, callback) {
  Code.
  find({username: username}).
  sort("-date").
  select('username language date title').
  limit(5).
  exec(callback);
};

module.exports.searchCodes = function(searchObj, callback) {
  Code.
  find({title: new RegExp(searchObj.searchString, "i"), privacy: "public"}).
  sort("-date").
  skip(searchObj.pn*20).
  limit(20).
  exec(callback);
};

module.exports.countCodes = function(searchObj, callback) {
  Code.
  find({title: new RegExp(searchObj.searchString, "i"), privacy: "public"}).
  count(callback);
};

module.exports.deleteCode = function(codeId, callback) {
  Code.find({
    _id: codeId
  }).remove(callback);
};
