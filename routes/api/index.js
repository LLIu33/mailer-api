var express = require('express');
var router = express.Router();

var users = require('./users');
var profiles = require('./profiles');
var templates = require('./templates');
var customers = require('./customers');
var mails =  require('./mails');

router.use('/users', users);
router.use('/profiles', profiles);
router.use('/templates', templates);
router.use('/customers', customers);
router.use('/mails', mails);

module.exports = router;
