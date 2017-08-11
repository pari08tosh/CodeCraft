// jshint esversion: 6, node: true

"use strict";

const mongoose  = require('mongoose');


const SectionSchema = mongoose.Schema({

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
  subtopic: {
    type: String,
    required: true,
  },
});

const Section = module.exports = mongoose.model('Section', SectionSchema);

module.exports.addSection = function(newSection, callback) {
  newSection.save(callback);
};

module.exports.getSection = function(section, callback) {
  Section.
  findOne({ name: section.name, subtopic: section.subtopic, topic: section.topic }).
  sort('modifiedDate').
  exec(callback);
};

module.exports.getAllSectionForSubtopic = function(subtopic,callback) {
  Section.
  find({ subtopic: subtopic.name, topic: subtopic.topic }).
  select('name').
  exec(callback);
};

module.exports.editSection = function(section, callback) {
  Section.findOneAndUpdate({ _id: section.id }, { $set: { name: section.name, body: section.body, modifiedDate: section.modifiedDate }}).
  exec(callback);
};

module.exports.deleteSectionBySubtopic = function(subtopic, topic, callback) {
  Section.find({ subtopic: subtopic, topic: topic }).remove(callback);
};

module.exports.deleteSection = function(section, callback) {
  Section.find({ name: section.name, subtopic: section.subtopic, topic: section.topic }).remove(callback);
};
