/**
 * Routing module for handling all routes under /mails
 */

/**
 * Import core modules
 */
var express = require('express');
var router = express.Router();
var authenticationHelpers = require('../authenticationHelpers');
var mailController = require('../../controllers').mailController;

// router.get('/:id', authenticationHelpers.isAuth, function(req, res) {
router.get('/', mailController.getAllMails);
router.post('/send-mail', mailController.sendMail);

module.exports = router;
