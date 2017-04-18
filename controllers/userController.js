var User = require('../models').User;
var mailHelper = require('../helpers/email');
var crypto = require('crypto');
var config = require('config');
var mailSettings = config.get('mail-settings');
var gravatar = require('gravatar');

mailSettings.poolConfig.auth.user = process.env.SMTP_USER || "";
mailSettings.poolConfig.auth.pass = process.env.SMTP_PASS || "";


exports.getMe = function(req, res) {
  var user_id = req.session.passport.user.id;
  return User.findOne({where: { id: user_id } })
    .then(function(data) {
      res.json({"me": data});
    }).catch(function(error) {
      res.status(500).json(error);
    });
}

exports.getUserById = function(user_id) {
  return User.findOne({
    where: {
      id: user_id
    }
  })
  .then(function(user) {
    return user;
  }).catch(function(err) {
    console.lot(err);
  });
}

exports.changePassword = function(req, res) {
  var user_id = req.session.passport.user.id;
  return User.findOne({
    where: {
      id: user_id
    }
  })
  .then(function(user) {
    if (!user.verifyPassword(req.body.password)) throw new Error("Password is invalid");
    if (req.body.newPassword !== req.body.confirmPassword) throw new Error("Password does not match the confirm password")
    user.password = User.generateHash(req.body.newPassword);
    return user.save()
    .then(function(updatedUser) {
      res.json(truncateUserObject(updatedUser));
    });
  })
  .catch(function(err) {
    console.log(err);
    res.status(400).json({
      error: 'bad request'
    });
  });
}

exports.updateUser = function(req, res) {
  User.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    req.body.password = (req.body.password) ? User.generateHash(req.body.password) : req.body.password;
    if (req.body.email) {
      req.body.profile_picture = gravatar.url(req.body.email);
    }
    user.update(req.body).then(function(data) {
      res.json(data);
    });
  }).catch(function(error) {
    res.status(500).json(error);
  });
}

var truncateUserObject = function(userAttributes) {
  return {
    "id": userAttributes.id,
    "email": userAttributes.email,
    "username": userAttributes.username,
    "password": User.generateHash(userAttributes.password),
    "profile_picture": userAttributes.profile_picture,
    "last_active": userAttributes.last_active
  }
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
