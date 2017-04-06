var templateController = require('./templateController');
var customerController = require('./customerController');
var mailController = require('./mailController');
var userController = require('./userController');
var profileController = require('./profileController');
var AuthenticationController = require('./authController')

module.exports = {
  templateController: templateController,
  customerController: customerController,
  mailController: mailController,
  userController: userController,
  profileController: profileController,
  AuthenticationController: AuthenticationController
}
