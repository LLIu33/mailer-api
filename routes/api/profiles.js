 /**
 * Routing module for handling all routes under /profiles
 */

/**
 * Import core modules
 */
var express = require('express');
var router  = express.Router();
var models  = require('../../models');
var authenticationHelpers = require('../authenticationHelpers');
var profileController = require('../../controllers').profileController;


router.get('/me', authenticationHelpers.isAuth, profileController.getMe);
router.get('/:user_id', authenticationHelpers.isAuth, profileController.getProfileById);
router.put('/:user_id', authenticationHelpers.isAuth, profileController.updateProfile);

module.exports = router;
