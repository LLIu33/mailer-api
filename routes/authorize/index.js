/**
 * Routing module for handling all routes under /authorize
 */

/**
 * Import core modules
 */
var express               = require('express');
var router                = express.Router();
var passport              = require('passport');
var authenticationHelpers = require('../authenticationHelpers');
var userController = require('../../controllers').userController;

/**
 * Authorization route for google provider
 */
// router.get('/google',
//   passport.authenticate('google', { scope: ['email'], accessType: 'offline'}
// ));

/**
 * Authorization route for twitter provider
 */
// router.get('/twitter', passport.authenticate('twitter'));

/**
 * Authorization route for local provider
 */
router.post('/local', function(request, response, next) {
  passport.authenticate('local', function(error, user, info) {
    if (!user) {
      response.status(400);
      response.json({"reason": "Username or password are not correct"});
    } else {
      request.logIn(user, function(error) {
        if (error) {
          response.status(500);
          response.json({"error": "Server error"});
        }
      });
      return userController.getUserById(user.id)
      .then(function(user) {
        return response.json(user);
      }).catch(function(error) {
        return response.json(error);
      });
    }
  })(request, response, next);
});

module.exports = router;
