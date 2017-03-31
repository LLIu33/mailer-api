/**
 * Routing module for handling all routes under /templates
 */

/**
 * Import core modules
 */
var express = require('express');
var router = express.Router();
var authenticationHelpers = require('../authenticationHelpers');
var templateController = require('../../controllers').templateController;

// router.get('/:id', authenticationHelpers.isAuth, function(req, res) {
router.get('/:id', templateController.getTemplateById);
router.get('/', templateController.getAllTemplates);
router.post('/', templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
