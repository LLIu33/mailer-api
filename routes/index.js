var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');

var AuthenticationController = require('../controllers').AuthenticationController;
var passportService = require('../config/passport');

// Middleware to require login/auth
var requireAuth = passport.authenticate('jwt', { session: false });
var requireLogin = passport.authenticate('local', { session: false });

// Import all other route modules
var api = require('./api');

router.use('/api', requireAuth, api);

router.post('/login', requireLogin, AuthenticationController.login);
router.post('/register', AuthenticationController.register);
router.post('/forgot', AuthenticationController.forgotPassword);
router.post('/reset', AuthenticationController.verifyToken);

router.get('/authenticated', requireAuth, function(req, res, next) {
  res.json({"authenticated": true});
});

router.get('/', function(request, response) {
  response.json({"made it": "ok"});
});

module.exports = router;
