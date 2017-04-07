/**
 * Import modules
 */
// var ngApp = require('../../main.node').ngApp;
var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var router = express.Router();
var authenticationHelpers = require('./authenticationHelpers');

// Import all other route modules
var api = require('./api');
// var authorize = require('./authorize');

router.use('/api', api);

module.exports = router;
