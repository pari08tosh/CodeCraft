//jshint esversion:6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');
const serverConfig = require('../config/server');
const multer = require('multer');
const path = require('path');
const Notification = require('../models/notification');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (serverConfig.productionMode) {
      cb(null, 'public/assets/images/avatars');
    } else {
      cb(null, 'angular-src/src/assets/images/avatars');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

 const fileUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
]);


// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    securityQuestion: req.body.securityQuestion,
    securityAns: req.body.securityAns,
    role: 'user',
    joinDate: Date.now(),
  });

  User.getUserByUsername(newUser.username, (err, data) => {
    if(!data) {
      User.addUser(newUser, (err, user) => {
        if(err){
          res.json({success: false, msg: 'Something went wrong :(. Please try again'});
        } else {
          const newNotification = new Notification({
            for: req.body.username,
            link: `/users/${ req.body.username }`,
            message: `Hi ${ req.body.name }, Welcome to codecraft. Take some time to update your profile`,
          });
          Notification.addNotification(newNotification, (err, data) => {
            if (err) {
              console.error(`Error adding registration notification
                ${err}`);
              res.json({
                success: false,
                msg: 'Something went wrong',
              });
            } else {
              res.json({
                success: true,
                msg:'Welcome to codecraft :D'});
            }
          });
        }
      });
    } else {
      res.json({success: false, msg:'Username Already Taken'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.authUser(username, (err, user) => {
    if (err) {
      console.log(`Error aunthenticating user
        ${ err }`);
    }
    if (!user) {
      return res.json({
        success: false,
        msg: 'Invalid Username',
      });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(`Error in password comparision
          ${ err }`);
      }
      if (isMatch) {
        let token = jwt.sign(user, config.secret, {
          expiresIn: 608400,
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
          },
          role: user.role,
        });
      } else {
        res.json({
          success: false,
          msg: 'Invalid Password',
        });
      }
    });
  });
});

// Profile
router.post('/profile', (req, res, next) => {
  const username = req.body.username;
  User.getUserByUsername(username, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

router.post('/updateProfile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    batch: req.body.batch,
    branch: req.body.branch,
    about: req.body.about,
    technologies: req.body.technologies,
    spojLink: req.body.spojLink,
    hackerearthLink: req.body.hackerearthLink,
    codechefLink: req.body.codechefLink,
    codeforcesLink: req.body.codeforcesLink,
    facebookLink: req.body.facebookLink,
    githubLink: req.body.githubLink,
    linkedInLink: req.body.linkedInLink,
    stackoverflowLink: req.body.stackoverflowLink,
  };
  User.authUser(user.username, (err, data) => {
    if (data.username === req.user.username) {
      User.updateProfile(user, (err, data) => {
        if (err) {
          console.error(`Error in updating profile
            ${ err }`);
          res.json({
            success: false,
            msg: `Something went wrong, please try again`,
          });
        } else {
          res.json({
            success: true,
            msg: `Profile updated Successfully`,
          });
        }
      });
    } else {
      res.json({
        success: false,
        msg: `Unauthorized`,
      });
    }
  });
});

router.post('/addAvatar',fileUpload, (req, res, next) => {
  const username = req.body.username;
  const avatarName = req.files['avatar'][0].filename;
  User.updateAvatar(username, avatarName, (err, data) => {
    if (err) {
      console.error(`Error in updating avatart
        ${ err }`);
      res.json({
        success: false,
        msg: `Error. Please go back and try again`,
      });
    } else {
      if (serverConfig.productionMode) {
        res.redirect('/users/' + username);
      } else {
        res.json({
          success: true,
          msg: `Avatar uploaded Successfully`,
        });
      }
    }
  });
});

router.post('/forgotPassword/username', (req, res, next) => {
  let username = req.body.username;
  User.forgotPassword(username, (err, user) => {
    if (err) {
      console.error(`Error in forgot password
        ${err}`);
    }
    if (user) {
      res.json({
        success: true,
        securityQuestion: user.securityQuestion,
      });
    } else {
      res.json({
        success: false,
        msg: 'Invalid Username',
      });
    }
  });
});

router.post('/forgotPassword/answer', (req, res, next) => {
  let username = req.body.username;
  let answer = req.body.answer;
  let password = req.body.password;
  User.forgotPassword(username, (err, user) => {
    if (err) {
      console.error(``);
    }
    if(answer === user.securityAns) {
      user.password = password;
      User.updatePassword(user, (err, data) => {
        if (err) {
          console.error(`Error in update password
            ${err}`);
        }
        res.json({
          success: true,
          msg: 'Password Changed',
        });
      });
    } else {
      res.json({
      success: false,
      msg: 'Wrong Answer',
    });
    }
  });
});

router.post('/checkUsername', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.body.username === req.user.username) {
    res.json({
      authentication: true,
    });
  } else {
    res.json({
      authentication: false,
    });
  }
});

router.get('/getRole', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({
    role: req.user.role,
  });
});

router.post('/searchPeople', (req, res, next) => {
  const searchObj = {
    searchString: req.body.searchString,
    pn: req.body.pn,
  };
  User.searchPeople(searchObj, (err, data) => {
    if (err) {
      console.error(`Error searching people
        ${ err }`);
    } else {
      res.send(data);
    }
  });
});

router.post('/countUsers', (req, res, next) => {
  const searchObj = {
    searchString: req.body.searchString,
  };
  User.countUsers(searchObj, (err, data) => {
    if (err) {
      console.log(`Error counting users
        ${err}`);
    } else {
      res.json({
        success: true,
        count: data,
      });
    }
  });
});

router.post('/makeContentManager', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role !== 'Admin') {
    res.json({
      success: false,
      msg: 'You are not Authorized',
    });
  } else {
    User.makeContentManager(req.body.id, (err, data) => {
      if (err) {
        res.json({
          success: false,
          msg: 'Something went wrong',
        });
      } else {
        const newNotification = new Notification({
          for: req.body.username,
          link: '/login',
          message: 'Congratulations! You are now a Content Manager. Login again to get your powers!',
        });
        Notification.addNotification(newNotification, (err, data) => {
          if (err) {
            console.error(`Error adding topic notification for content manager
              ${err}`);
            res.json({
              success: false,
              msg: 'Something went wrong',
            });
          } else {
            res.json({
              success: true,
              msg: 'User is now a content manager',
            });
          }
        });
      }
    });
  }
});

router.get('/getTeam', (req, res, next) => {
  User.getTeam((err, data) => {
    if (err) {
      console.error(`Error fetching team`);
    } else {
      res.send(data);
    }
  });
});
module.exports = router;
