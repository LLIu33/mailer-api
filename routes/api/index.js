/**
 * Routing module for handling all routes under /api
 */

/**
 * Import core modules
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticationHelpers = require('../authenticationHelpers');
var users = require('./users');
var profiles = require('./profiles');
var templates = require('./templates');
var customers = require('./customers');
var mails =  require('./mails');
var AuthenticationController = require('../../controllers').AuthenticationController;

var passportService = require('../../config/passport');

// Middleware to require login/auth
var requireAuth = passport.authenticate('jwt', { session: false });
var requireLogin = passport.authenticate('local', { session: false });

router.use('/users', users);
router.use('/profiles', profiles);
router.use('/templates', templates);
router.use('/customers', customers);
router.use('/mails', mails);

router.post('/login', requireLogin, AuthenticationController.login);

router.get('/authenticated', authenticationHelpers.isAuth, function(req, res, next) {
  res.json({"authenticated": true});
});

router.get('/', function(request, response) {
  response.json({"made it": "ok"});
});

module.exports = router;
