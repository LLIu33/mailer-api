var express = require('express');
var router  = express.Router();
var models  = require('../../models');
var authenticationHelpers = require('../authenticationHelpers');
var userController = require('../../controllers').userController;


router.get('/me', authenticationHelpers.isAuth, userController.getMe);
// router.post('/register', authenticationHelpers.isNotAuthOrRedirect, userController.register);
// router.post('/forgot', authenticationHelpers.isNotAuthOrRedirect, userController.forgotPassword);
// router.post('/update-password', authenticationHelpers.isNotAuthOrRedirect, userController.updatePassword);
router.post('/change-password', authenticationHelpers.isAuth, userController.changePassword);
router.put('/:id', authenticationHelpers.isAuth, userController.updateUser);

module.exports = router;
