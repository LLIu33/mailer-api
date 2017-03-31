var Profile = require('../models').Profile;


exports.getMe = function(req, res) {
  var user_id = req.session.passport.user.id;
  return Profile.findOne({where: { user_id: user_id } })
  .then(function(data) {
    res.json({"me": data});
  }).catch(function(error) {
    res.status(500).json(error);
  });
}

exports.getProfileById = function(req, res) {
  return Profile.findOne({where: { user_id: req.params.id } })
  .then(function(profile) {
    console.log(profile);
    res.json(truncateProfileObject(profile));
  }).catch(function(error) {
    console.log(error);
    res.status(500).json(error);
  });
}

exports.updateProfile = function(req, res) {
    Profile.findOne({
    where: {
      user_id: req.params.user_id
    }
  }).then(function(profile) {
    profile.update(req.body).then(function(data) {
      res.json(data);
    });
  }).catch(function(error) {
    res.status(500).json(error);
  });
}

var truncateProfileObject = function(profileAttributes) {
  return {
    "user_id": profileAttributes.user_id,
    "first_name": profileAttributes.first_name,
    "last_name": profileAttributes.last_name,
    "smtp_server": profileAttributes.smtp_server,
    "smtp_username": profileAttributes.smtp_username,
    "smtp_password": profileAttributes.smtp_password,
    "smtp_port": profileAttributes.smtp_port
  }
}
