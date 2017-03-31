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
router.use('/authorize', authorize);

/* GET home page. */
/* Purest route */
// router.get('/', authenticationHelpers.isAuthOrRedirect, ngApp);

// /* GET login page. */
// router.get('/login', authenticationHelpers.isNotAuthOrRedirect, ngApp);

// /* GET register page. */
// router.get('/register', authenticationHelpers.isNotAuthOrRedirect, ngApp);

/* GET logout page. */
router.get('/logout', authenticationHelpers.isAuthOrRedirect, function(req, res, next) {
  // req.logout();
  req.session.destroy(function(error) {
    console.log(error);
    res.redirect('/login');
  });

});

/* GET forgot page. */
// router.get('/forgot', authenticationHelpers.isNotAuthOrRedirect, ngApp);


/* GET forgot page. */
router.get('/reset/:token', authenticationHelpers.isNotAuthOrRedirect, function(req, res, next) {
  User.findOne({
      where: {
        reset_password_token: req.params.token,
        reset_password_expires: {
          $gt: Date.now() / 1000 | 0
        }
      }
    })
    .then(function(user) {
      ngApp(req, res);
    }).catch(function(err) {
      console.log(err);
      res.redirect('/forgot'); //add error message
    });
});

/**
 * Define our google callback endpoint and success/failure methods
 */
// router.get('/callback/google',
//   passport.authenticate('google', {
//     successRedirect: '/',
//     failureRedirect: '/login'
// }));

/**
 * Define our twitter callback endpoint and success/failure methods
 */
// router.get('/callback/twitter',
//   passport.authenticate('twitter', {
//     successRedirect: '/',
//     failureRedirect: '/login'
// }));

/**
 * Anything else under root route '/'
 * The main purpose of this is to facilitate the Angular 2 HTML 5 routing
 * It is imperative that this goes below absolutely every route definition since
 * this is the index.js, and if it came before say, the route.use('/api', api), everything
 * that would call /api would be read as /*
 */
// router.get("/*", authenticationHelpers.isAuthOrRedirect, ngApp);

module.exports = router;
