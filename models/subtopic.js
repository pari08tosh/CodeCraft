// jshint esversion: 6, node: true

"use strict";

const mongoose  = require('mongoose');


const SubtopicSchema = mongoose.Schema({

  name: {
    required: true,
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
  topic: {
    type: String,
    required: true,
  },
});

const Subtopic = module.exports = mongoose.model('Subtopic', SubtopicSchema);

module.exports.addSubtopic = function(newSubtopic, callback) {
  newSubtopic.save(callback);
};

module.exports.getSubtopic = function(subtopic, callback) {
  Subtopic.
  findOne({ name: subtopic.name, topic: subtopic.topic }).
  sort('modifiedDate').
  exec(callback);
};

module.exports.getSubtopicForEboook = function(topic, subtopic, callback) {
  Subtopic.
  findOne({ name: subtopic, topic: topic }).
  exec(callback);
};

module.exports.getAllSubtopicForTopic = function(topic, callback) {
  Subtopic.
  find({ topic: topic.name }).
  select('name').
  exec(callback);
};

module.exports.editSubtopic = function(subtopic, callback) {
  Subtopic.findOneAndUpdate({ _id: subtopic.id }, { $set: { name: subtopic.name, body: subtopic.body, modifiedDate: subtopic.modifiedDate }}).
  exec(callback);
};

module.exports.deleteSubtopicByTopic = function(topic, callback) {
  Subtopic.find({ topic: topic }).remove(callback);
};

module.exports.deleteSubtopic = function(subtopic, callback) {
  Subtopic.find({ name: subtopic.name, topic: subtopic.topic }).remove(callback);
};
