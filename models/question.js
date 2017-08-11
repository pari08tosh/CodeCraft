// jshint esversion: 6, node: true

"use strict";

const mongoose = require('mongoose');
const config = require('../config/database');

const QuestionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  tags: [],
  username: {
    type: String,
    required: true,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
  answers: {
    type: Number,
    default: 0,
  }
});

const Question = module.exports = mongoose.model('Question', QuestionSchema);

module.exports.countQuestions = function(questionObj, callback) {
  if (questionObj.tag) {
    Question.find({ tags: questionObj.tag }).count(callback);
    } else {
      if (questionObj.searchString) {
        Question.find({$or: [
          { question: new RegExp(questionObj.searchString, "i")},
          { tags: new RegExp(questionObj.searchString, "i")},
        ]}).
        count(callback);
      } else {
        Question.find().count(callback);
      }
    }
};

module.exports.addAnswer = function(questionId, callback) {
  Question.findByIdAndUpdate(questionId, { $inc: {answers: 1}}).
  exec(callback);
};

module.exports.removeAnswer = function(questionId, callback) {
  Question.findByIdAndUpdate(questionId, { $inc: {answers: -1}});
};

module.exports.getQuestions = function(pn, tag, callback) {
  if (tag === null) {
    Question.
      find().
      sort('-modifiedDate').
      select('question username tags modifiedDate answers').
      skip(pn*10).
      limit(10).
      exec(callback);
    } else {
      Question.
      find({$or: [
        { tags: new RegExp(tag, "i")},
      ]}).
        sort('-modifiedDate').
        select('question username tags modifiedDate answers').
        skip(pn*10).
        limit(10).
        exec(callback);
    }
};

module.exports.searchQuestion = function(searchObj, callback) {
  Question.
    find({$or: [
      { question: new RegExp(searchObj.searchString, "i")},
      { tags: new RegExp(searchObj.searchString, "i")},
    ]}).
    sort('-modifiedDate').
    select('question username tags modifiedDate answers').
    skip(searchObj.pn*10).
    limit(10).
    exec(callback);
};

module.exports.getQuestionById = function(id, callback) {
  Question.findById(id, callback);
};

module.exports.insertQuestion = function(newQuestion, callback) {
  newQuestion.save(callback);
};

module.exports.editQuestion = function(question, callback) {
  Question.findOneAndUpdate({ _id: question.id}, { $set: { question: question.question, tags: question.tags, modifiedDate: question.modifiedDate }}).
  exec(callback);
};

module.exports.getQuestionByUsername = function(username, callback) {
  const query = { username: username };
  Question.find(query).sort('-modifiedDate').exec(callback);
};

module.exports.deleteQuestion = function(QuestionId, callback) {
  Question.find({ _id: QuestionId }).remove(callback);
};
