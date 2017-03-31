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

exports.register = function(req, res) {
  userAttributes.provider = 'local';
  userAttributes.profile_picture = gravatar.url(userAttributes.email);;
  userAttributes.password = User.generateHash(userAttributes.password);

  return userExists(userAttributes)
  .then(function(exists) {
    if (exists) throw new Error("User already exists");

    return User.create(userAttributes)
    .then(function(newUser) {
      res.json(truncateUserObject(newUser));
    }).catch(function(error) {
      console.log(error);
      res.status(400).json({"reason": error.message});
    });

  }).catch(function(error) {
    console.log(error);
    throw error;
  });
}

exports.forgotPassword = function(req, res) {
  var buf = crypto.randomBytes(20);
  var token = buf.toString('hex');

  return User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(function (user) {
    if (!user) {
      res.status(400).json({
        error: 'No account with that email address exists.'
      });
      return;
    }

    user.reset_token = token;
    user.reset_token_expires = (Date.now() + 2 * 60 * 60 * 1000) / 1000 | 0; // 2 hours
    return user.save()
    .then(function () {
      var mailOptions = {
        to: user.email,
        from: mailSettings.fromString,
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      return mailHelper.sendMail(mailOptions, mailSettings.poolConfig)
      .then(function () {
        res.json({
          message: 'An e-mail has been sent to ' + req.body.email + ' with further instructions.'
        });
      })
      .catch(function(err) {
        console.log(err);
        res.status(400).json({
          error: 'bad request'
        });
      });
    });
  });
}

exports.updatePassword = function(req, res) {
  return User.findOne({
    where: {
      reset_password_token: req.body.token,
      reset_password_expires: {
        $gt: Date.now() / 1000 | 0
      }
    }
  })
  .then(function(user) {
    if (!user) throw new Error("Token is invalid");
    user.password = User.generateHash(req.body.password);
    user.reset_password_token = "";
    user.reset_password_expires = 0;
    console.log(user);
    return user.save()
    .then(function(updatedUser) {
      res.json(truncateUserObject(updatedUser));
    })
    .catch(function(err) {
      console.log(err);
      res.status(400).json({
        error: 'bad request'
      });
    });
  })
  .catch(function(err) {
    console.log(err);
    res.status(400).json({
      error: 'bad request'
    });
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
