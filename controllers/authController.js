var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var Sequelize = require("sequelize");
var User = require('../models').User;
// var mailgun = require('../config/mailgun');
var mailHelper = require('../helpers/email');
var crypto = require('crypto');
var config = require('config');
var mailSettings = config.get('mail-settings');
var gravatar = require('gravatar');

mailSettings.poolConfig.auth.user = process.env.SMTP_USER || "";
mailSettings.poolConfig.auth.pass = process.env.SMTP_PASS || "";

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.get("secret"), {
    expiresIn: 604800 // in seconds
  });
}

function userExists(userAttributes) {
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
    "id": user.id || null,
    "email": user.email,
    "username": user.username || "",
    "password": User.generateHash(user.password),
    "profile_picture": gravatar.url(user.profile_picture) || "",
    "last_active": user.last_active || ""
  }
}

//= =======================================
// Login Route
//= =======================================
exports.login = function (req, res, next) {
  var userInfo = setUserInfo(req.body);

  res.status(200).json({
    token: `${generateToken(userInfo)}`,
    user: userInfo
  });
};


//= =======================================
// Registration Route
//= =======================================
exports.register = function (req, res, next) {
  var user = setUserInfo(req.body);
  user.provider = 'local';
  user.name = user.username;

  return userExists(user)
  .then(function(exists) {
    if (exists) throw new Error("User already exists");
    return User.create(user)
    .then(function(newUser) {
      var userInfo = setUserInfo(newUser);
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

exports.forgotPassword = function (req, res, next) {
  const email = req.body.email;

  User.findOne({where: {email: email}})
  .then((existingUser, err) => {
    // If user is not found, return error
    if (!existingUser) {
     res.status(422).json({error: 'No account with that email address exists.'});
    }

    // If user is found, generate and save resetToken

    // Generate a token with Crypto
    const buffer = crypto.randomBytes(48);
    const resetToken = buffer.toString('hex');

    existingUser.reset_token = resetToken;
    existingUser.reset_token_expires = (Date.now() + 2 * 60 * 60 * 1000) | 0; // 2 hours
    return existingUser.save()
    .then(function () {
      const message = {
        to: existingUser.email,
        from: mailSettings.fromString,
        subject: 'Reset Password',
        text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };

      return mailHelper.sendMail(message, mailSettings.poolConfig)
      .then(function (result) {
        res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
      });
    });
  });
};

//= =======================================
// Reset Password Route
//= =======================================

exports.verifyToken = function (req, res, next) {
  return User.findOne({
    where: {
      reset_password_token: req.body.token,
      reset_password_expires: {
        $gt: Date.now()
      }
    }
  })
  .then(function(resetUser) {
  // User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
    // If query returned no results, token expired or was invalid. Return error.
    if (!resetUser) {
      res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
    }

      // Otherwise, save new password and clear resetToken from database
    resetUser.password = req.body.password;
    resetUser.reset_password_token = undefined;
    resetUser.reset_password_expires = undefined;

    return resetUser.save()
    .then(() => {
        // If password change saved successfully, alert user via email
      const message = {
        to: resetUser.email,
        from: mailSettings.fromString,
        subject: 'Password Changed',
        text: 'You are receiving this email because you changed your password. \n\n' +
          'If you did not request this change, please contact us immediately.'
      };

      mailHelper.sendMail(message, mailSettings.poolConfig)
      .then(() => {
        res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
      });
    });
  });
};
