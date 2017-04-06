var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var User = require('../models/user');
var User = require('../models').User;
// var mailgun = require('../config/mailgun');
var mailHelper = require('../helpers/email');
var crypto = require('crypto');
var config = require('config');
var mailSettings = config.get('mail-settings');
var gravatar = require('gravatar');

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // in seconds
  });
}

var userExists = function(userAttributes) {
  return User.findOne({
    where: Sequelize.and({
      provider: 'local'
    },
    Sequelize.or({
      username: userAttributes.username
    }, {
      email: userAttributes.email
    })
    )
  }).then(function(user) {
    console.log(user);
    if (!user) return false;
    return true;
  }).catch(function(error) {
    console.log(error);
    throw error;
  });
}

function setUserInfo(user) {
  return {
    "id": user.id,
    "email": user.email,
    "username": user.username,
    "password": User.generateHash(user.password),
    "profile_picture": user.profile_picture,
    "last_active": user.last_active
  }
}

//= =======================================
// Login Route
//= =======================================
exports.login = function (req, res, next) {
  var userInfo = setUserInfo(req.body);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};


//= =======================================
// Registration Route
//= =======================================
exports.register = function (req, res, next) {
  var userAttributes = setUserInfo(req.body);
  var user = {
    provider: 'local',
    profile_picture: gravatar.url(userAttributes.email),
    password: User.generateHash(userAttributes.password)
  }

  return userExists(user)
  .then(function(exists) {
    if (exists) throw new Error("User already exists");

    return User.create(user)
    .then(function(newUser) {
      var userInfo =  setUserInfo(newUser);
      res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
      });
    }).catch(function(error) {
      console.log(error);
      res.status(400).json({"reason": error.message});
    });

  }).catch(function(error) {
    console.log(error);
    throw error;
  });
};

//= =======================================
// Forgot Password Route
//= =======================================

// exports.forgotPassword = function (req, res, next) {
//   const email = req.body.email;

//   User.findOne({ email }, (err, existingUser) => {
//     // If user is not found, return error
//     if (err || existingUser == null) {
//       res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
//       return next(err);
//     }

//       // If user is found, generate and save resetToken

//       // Generate a token with Crypto
//     crypto.randomBytes(48, (err, buffer) => {
//       const resetToken = buffer.toString('hex');
//       if (err) { return next(err); }

//       existingUser.resetPasswordToken = resetToken;
//       existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//       existingUser.save((err) => {
//           // If error in saving token, return it
//         if (err) { return next(err); }

//         const message = {
//           subject: 'Reset Password',
//           text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//             'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//             'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
//             `If you did not request this, please ignore this email and your password will remain unchanged.\n`
//         };

//           // Otherwise, send user email via Mailgun
//         // mailgun.sendEmail(existingUser.email, message);

//         return res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
//       });
//     });
//   });
// };

//= =======================================
// Reset Password Route
//= =======================================

// exports.verifyToken = function (req, res, next) {
//   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
//     // If query returned no results, token expired or was invalid. Return error.
//     if (!resetUser) {
//       res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
//     }

//       // Otherwise, save new password and clear resetToken from database
//     resetUser.password = req.body.password;
//     resetUser.resetPasswordToken = undefined;
//     resetUser.resetPasswordExpires = undefined;

//     resetUser.save((err) => {
//       if (err) { return next(err); }

//         // If password change saved successfully, alert user via email
//       const message = {
//         subject: 'Password Changed',
//         text: 'You are receiving this email because you changed your password. \n\n' +
//           'If you did not request this change, please contact us immediately.'
//       };

//         // Otherwise, send user email confirmation of password change via Mailgun
//       // mailgun.sendEmail(resetUser.email, message);

//       return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
//     });
//   });
// };
