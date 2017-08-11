// jshint esversion: 6, node: true

"use strict";

const mongoose  = require('mongoose');


const EbookSchema = mongoose.Schema({

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
  ebookLink: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
    default: 'assets/images/defaultEbook.png',
  }
});

const Ebook = module.exports = mongoose.model('Ebook', EbookSchema);

module.exports.addEbook = function(newEbook, callback) {
  newEbook.save(callback);
};

module.exports.getEbooksForContent = function(ebook, callback) {
  Ebook.
  find({ subtopic: ebook.subtopic, topic: ebook.topic }).
  sort('modifiedDate').
  exec(callback);
};

module.exports.getEbookById = function(id, callback) {
  Ebook.findById(id, callback);
};

module.exports.deleteEbook = function(ebook, callback) {
  Ebook.findOneAndRemove({ _id: ebook.id }, callback);
};
