// jshint esversion: 6, node: true

"use strict";

const mongoose  = require('mongoose');


const StudyFileSchema = mongoose.Schema({

  name: {
    required: true,
    type: String,
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
  fileLink: {
    type: String,
    required: true,
  },
});

const StudyFile = module.exports = mongoose.model('StudyFile', StudyFileSchema);

module.exports.addStudyFile = function(newStudyFile, callback) {
  newStudyFile.save(callback);
};

module.exports.getStudyFilesForContent = function(studyFile, callback) {
StudyFile.
  find({ subtopic: studyFile.subtopic, topic: studyFile.topic }).
  sort('modifiedDate').
  exec(callback);
};

module.exports.getStudyFileById = function(id, callback) {
StudyFile.findById(id, callback);
};

module.exports.deleteStudyFile = function(studyFile, callback) {
StudyFile.findOneAndRemove({ _id: studyFile.id }, callback);
};
