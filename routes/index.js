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
var authorize = require('./authorize');
var User = require('../models').User;

/**
 * Make sure the "use" of any other route modules comes before
 * any index route definitions, aka route definitions from root '/'
 */
router.use('/api', api);
// router.use('/api', authorize);

/* GET home page. */
/* Purest route */
// router.get('/', authenticationHelpers.isAuthOrRedirect, ngApp);

// /* GET login page. */
// router.get('/login', authenticationHelpers.isNotAuthOrRedirect, ngApp);

// /* GET register page. */
// router.get('/register', authenticationHelpers.isNotAuthOrRedirect, ngApp);

/* GET forgot page. */
// router.get('/forgot', authenticationHelpers.isNotAuthOrRedirect, ngApp);


/* GET forgot page. */
// router.get('/reset/:token', authenticationHelpers.isNotAuthOrRedirect, function(req, res, next) {
//   User.findOne({
//       where: {
//         reset_password_token: req.params.token,
//         reset_password_expires: {
//           $gt: Date.now() / 1000 | 0
//         }
//       }
//     })
//     .then(function(user) {
//       // ngApp(req, res);
//     }).catch(function(err) {
//       console.log(err);
//       res.redirect('/forgot'); //add error message
//     });
// });

module.exports = router;
