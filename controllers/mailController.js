var models = require('../models');
var mailHelper = require('../helpers/email');

exports.getAllMails = function(req, res) {
  models.Mail.findAll({order: 'created_at DESC'})
  .then(function(mails) {
    res.json(mails);
  }).catch(function(err) {
    console.log(err);
    res.status(400).json({
      error: 'bad request'
    });
  });
};

//TODO: fix error handler
exports.sendMail = function(req, res) {

  var mailOptions = {
    to: req.body.mail.to || "",
    from: req.body.mail.from || req.body.profile.first_name + " " + req.body.profile.last_name + " <" + req.body.profile.smtp_username + ">",
    subject: req.body.mail.subject || "",
    text: req.body.mail.content || ""
  };

  var poolConfig = {
    pool: true,
    host: req.body.profile.smtp_server || "",
    port: req.body.profile.smtp_port || "",
    secure: true, // use SSL
    auth: {
      user: req.body.profile.smtp_username || "",
      pass: req.body.profile.smtp_password || ""
    }
  };
  var originalOptions = Object.assign({}, mailOptions);
  mailHelper.sendMail(mailOptions, poolConfig)
  .then(function(data) {
    return models.Mail.build({
      from: originalOptions.from,
      to: originalOptions.to,
      subject: originalOptions.subject,
      content: originalOptions.text
    })
    .save()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      console.log(err);
      res.status(400).json({
        message: 'bad request',
        error: err,
        credentials: [mailOptions, poolConfig]
      });
    });
  })
  .catch(function(err) {
    console.log(err);
    res.status(400).json({
      message: 'bad request',
      error: err,
      credentials: [mailOptions, poolConfig]
    });
  });
};
