// jshint esversion: 6, node: true

"use strict";

const mongoose = require('mongoose');

const SourceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const Source = module.exports = mongoose.model('Source', SourceSchema);

module.exports.addSource = function(newSource, callback) {
  newSource.save(callback);
};

module.exports.getAllSource = function(callback) {
  Source.
  find().
  exec(callback);
};
