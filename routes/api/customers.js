var express = require('express');
var router = express.Router();
var authenticationHelpers = require('../authenticationHelpers');
var customerController = require('../../controllers').customerController;

// router.get('/:id', authenticationHelpers.isAuth, function(req, res) {
router.get('/', customerController.getAllCustomers);
router.get('/sync', customerController.syncCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
