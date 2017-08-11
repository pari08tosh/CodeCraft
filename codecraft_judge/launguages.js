// jshint esversion: 6, node: true

"use strict";

const exec = require('child_process').exec;
const fs = require('fs');

// Code run options. Change timout to change maximum time any code is allowed to run.
const runOptions = {
  encoding: 'utf8',
  timeout: 3000,
  killSignal: 'STOP',
};

function replaceClass(code, fileName, callback) {
  var regex = /TestClass/g;

  callback(code);
}

// Add new launguages below as per the given template.
module.exports = {
  /**
  Example Template

  launguageName: {
    extension: String,
    compiled: Boolean,
    compileFunction: function,
    iterpreted: Boolean,
    interpretFunction: function,
    execFunction: function (also delete the executable file and provide the processId with callback)
  }
  */
  c: {
    extension: '.c',
    compiled: true,
    compileFunction: function(fileName, callback) {
     exec(`gcc ./temp/${ fileName }.c -o ./temp/${ fileName }`, (error, stdout, stderr) => {
        callback (error, stdout, stderr);
      });
    },
    interpreted: false,
    interpretFunction: null,
    execFunction: function (fileName, callback) {
      let process = exec(`./temp/${ fileName } < ./temp/${ fileName }.txt`, runOptions, (error, stdout, stderr) => {
        fs.unlink(`./temp/${ fileName }`, () => {
        });
        callback(error, stdout, stderr, process.pid);
      });
    },
  },

  cpp: {
    extension: '.cpp',
    compiled: true,
    compileFunction: function(fileName, callback) {
      exec(`g++ -std=c++14 ./temp/${ fileName }.cpp -o ./temp/${ fileName }`, (error, stdout, stderr) => {
        callback (error, stdout, stderr);
      });
    },
    interpreted: false,
    interpretFunction: null,
    execFunction: function (fileName, callback) {
      let process = exec(`./temp/${ fileName } < ./temp/${ fileName }.txt`, runOptions, (error, stdout, stderr) => {
        fs.unlink(`./temp/${ fileName }`, () => {
        });
        callback(error, stdout, stderr, process.pid);
      });
    },
  },

  java: {
    extension: '.java',
    compiled: true,
    compileFunction: function(fileName, callback) {
      let code = fs.readFileSync(`./temp/${ fileName }.java`, "utf8");
      code = code.replace(new RegExp('TestClass', 'g'), fileName);
      fs.writeFileSync(`./temp/${ fileName }.java`, code);
      exec(`javac ./temp/${ fileName }.java`, (error, stdout, stderr) => {
        callback (error, stdout, stderr);
      });
    },
    interpreted: false,
    interpretFunction: null,
    execFunction: function (fileName, callback) {
      exec(`cd ./temp && java ${ fileName } < ${ fileName }.txt`, runOptions, (error, stdout, stderr) => {
        fs.unlink(`./temp/${ fileName }.class`, () => {
        });
        callback(error, stdout, stderr);
      });
    },
  },

  python2: {
    extension: '.py',
    compiled: false,
    compileFunction: null,
    interpreted: true,
    interpretFunction: function (fileName, callback) {
      let process = exec(`python2 ./temp/${ fileName }.py < ./temp/${ fileName }.txt`, runOptions, (error, stdout, stderr) => {
        callback (error, stdout, stderr, process.pid);
      });
    },
    execFunction: null,
  },

  python3: {
    extension: '.py',
    compiled: false,
    compileFunction: null,
    interpreted: true,
    interpretFunction: function (fileName, callback) {
      let process = exec(`python3 ./temp/${ fileName }.py < ./temp/${ fileName }.txt`, runOptions, (error, stdout, stderr) => {
        callback (error, stdout, stderr, process.pid);
      });
    },
    execFunction: null,
  },
};
