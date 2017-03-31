var config = require('config');
var trapConfig = config.get('trap-config');
var nodemailer = require('nodemailer');
var trap = require('nodemailer-trap-plugin').trap;

exports.sendMail = function (mailSettings, poolConfig) {
  var nodemailerTransport = nodemailer.createTransport(poolConfig);
  if (trapConfig['enabled']) {
    nodemailerTransport.use('compile', trap({
        to: trapConfig['redirect-mail']
    }));
  }
  return nodemailerTransport.sendMail(mailSettings)
  .then(function() {
    return mailSettings;
  });
};
