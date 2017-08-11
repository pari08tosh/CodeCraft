// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const randomString = require("randomstring");
const launguagesObj = require('./launguages');
const cp = require('child_process');
const psTree = require('ps-tree');

// Port
const port = 8080;

const app = express();

// Init cors
app.use(cors());

//Init body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/runCode', (req, res, next) => {
  const language = req.body.language;
  const code = req.body.code;
  const testString = req.body.testString;
  const fileName = randomString.generate({
    length: 16,
    charset: 'alphabetic'
  });

  fs.writeFileSync(`./temp/${ fileName }${ launguagesObj[language].extension }`, code);
  fs.writeFileSync(`./temp/${ fileName }.txt`, testString);

  if (launguagesObj[language].compiled) {
    launguagesObj[language].compileFunction (fileName, (error, stdout, stderr) => {
      if (stderr) {

        const err = `
        --------------Compilation Error--------------

        ${stderr}`;
        res.json({
          success: false,
          output: err,
        });
        return;
      }

      if (error) {
        res.json({
          success: false,
          output: `Judge Error. Please Try Again`,
        });
      }

      const startTime = Date.now();
      launguagesObj[language].execFunction(fileName, (error, stdout, stderr, pid) => {
        fs.unlink(`./temp/${ fileName }${ launguagesObj[language].extension }`, () => {
        });
        fs.unlink(`./temp/${ fileName }.txt`, () => {
        });

        const endTime = (Date.now() - startTime)/1000;
        if (stderr) {
          return res.json({
            success: false,
            output: `
            ----------------Runtime Error----------------
              ${stderr}`,
          });
        } else {
          if (error) {
            console.log(error);
            if (error.message === `stdout maxBuffer exceeded`) {
              return res.json({
                success: false,
                output: `Max I/O buffer size exeeded`,
              });
            } else {
              psTree(pid, function (err, children) {
                cp.spawn('kill', ['-9'].concat(children.map(function (p) { return p.PID; })));
              });
              return res.json({
                success: false,
                output: `Time Limit Exceeded (3s)`,
              });
            }
          } else {
            res.json({
              success: true,
              output: stdout,
              runtime: endTime,
            });
          }
        }
      });
    });
  } else {
    const startTime = Date.now();
    launguagesObj[language].interpretFunction(fileName, (error, stdout, stderr, pid) => {

      fs.unlink(`./temp/${ fileName }${ launguagesObj[language].extension }`, () => {
      });
      fs.unlink(`./temp/${ fileName }.txt`, () => {
      });

      const endTime = (Date.now() - startTime)/1000;
      if (stderr) {
        return res.json({
          success: false,
          output: `
          ----------------Error----------------

          ${stderr}`,
        });
      } else {
        if (error) {
          psTree(pid, function (err, children) {
            cp.spawn('kill', ['-9'].concat(children.map(function (p) { return p.PID; })));
          });
          res.json({
            success: false,
            output: `Time Limit Exceeded (3s)`,
          });
        } else {
          res.json({
            success: true,
            output: stdout,
            runtime: endTime,
          });
        }
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Judge started on port ${port}`);
});
