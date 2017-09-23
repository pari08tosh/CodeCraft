//jshint esversion:6, node: true

"use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const serverConfig = require('./config/server');
const blogs = require('./routes/blogs');
const users = require('./routes/users');
const comments = require('./routes/comments');
const topics = require('./routes/topics');
const subtopics = require('./routes/subtopics');
const sections = require('./routes/sections');
const ebooks = require('./routes/ebooks');
const questions = require('./routes/questions');
const answers = require('./routes/answers');
const notifications = require('./routes/notifications');
const playlists = require('./routes/playlists');
const feedbacks = require('./routes/feedbacks');
const newsFeeds = require('./routes/newsFeeds');
const sources = require('./routes/sources');
const imageUploads = require('./routes/imageUploads');
const codes = require('./routes/codes');
const studyFiles  = require('./routes/studyFiles');

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database');
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

// Port Number
const port = serverConfig.port;

// CORS Middleware
app.use(cors());

// Set Static Folder
let accessCount = 0;
app.use((req, res, next) => {
  if (req.originalUrl === '/') {
    ++accessCount;
    console.log(`Server Hit Number ${ accessCount } from ${ req.connection.remoteAddress}`);
  }
  next();
}, express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Routes
app.use('/users', users);
app.use('/blogs', blogs);
app.use('/comments', comments);
app.use('/topics', topics);
app.use('/subtopics', subtopics);
app.use('/sections', sections);
app.use('/ebooks', ebooks);
app.use('/questions', questions);
app.use('/answers', answers);
app.use('/notifications', notifications);
app.use('/playlists', playlists);
app.use('/feedbacks', feedbacks);
app.use('/newsFeeds', newsFeeds);
app.use('/sources', sources);
app.use('/imageUploads', imageUploads);
app.use('/codes', codes);
app.use('/studyFiles', studyFiles);

// Index Route
app.get('*', (req, res, next) => {
  //** when server is active
  ++accessCount;
  console.log(`Server Hit Number ${ accessCount } from ${ req.connection.remoteAddress}`);
   res.sendFile(path.join(__dirname + '/public/index.html'));

  // When server is down
  // res.send("Server is down");
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
