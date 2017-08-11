// jshint esversion: 6, node: true

"use strict";

const mongoose  = require('mongoose');


const TopicSchema = mongoose.Schema({

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
});

const Topic = module.exports = mongoose.model('Topic', TopicSchema);

module.exports.addTopic = function(newTopic, callback) {
  newTopic.save(callback);
};

module.exports.getTopic = function(topic, callback) {
  Topic.
  findOne({ name: topic.name }).
  sort('modifiedDate').
  exec(callback);
};

module.exports.getAllTopicNames = function(callback) {
  Topic.
  find().
  select('name').
  exec(callback);
};

module.exports.editTopic = function(topic, callback) {
  Topic.findOneAndUpdate({ _id: topic.id }, { $set: { name: topic.name, body: topic.body, modifiedDate: topic.modifiedDate }}).
  exec(callback);
};

module.exports.deleteTopic = function(topic, callback) {
  Topic.find({ name: topic.name }).remove(callback);
};
