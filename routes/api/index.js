/**
 * Routing module for handling all routes under /api
 */

/**
 * Import core modules
 */
var express = require('express');
var router = express.Router();
var authenticationHelpers = require('../authenticationHelpers');
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

router.get('/authenticated', authenticationHelpers.isAuth, function(req, res, next) {
  res.json({"authenticated": true});
});

router.get('/', function(request, response) {
  response.json({"made it": "ok"});
});

module.exports = router;
