// jshint esversion: 6, node: true

"use strict";

const mongoose = require('mongoose');
const config = require('../config/database');

const AnswerSchema = mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  questionId: {
    type: String,
    required: true,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
});

const Answer = module.exports = mongoose.model('Answer', AnswerSchema);

module.exports.insertAnswer = function(newAnswer, callback) {
  newAnswer.save(callback);
};

module.exports.editAnswer = function(answer, callback) {
  Answer.findOneAndUpdate({ _id: answer.id}, { $set: { body: answer.body, modifiedDate: answer.modifiedDate }}).
  exec(callback);
};

module.exports.getAnswerByQuestion = function(questionId, callback) {
  const query = { questionId: questionId };
  Answer.find(query).sort('-modifiedDate').exec(callback);
};

module.exports.getAnswerById = function(answerId, callback) {
  Answer.findOne({ _id: answerId }, callback);
};

module.exports.deleteAnswer = function(answerId, callback) {
  Answer.find({ _id: answerId }).remove(callback);
};

module.exports.deleteAnswerByQuestion = function(questionId, callback) {
  Answer.find({ questionId: questionId }).remove(callback);
};
