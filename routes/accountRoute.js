const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/registration', utilities.handleErrors(accountController.buildRegistration))
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
router.get('/account', utilities.handleErrors(accountController.buildAccountManagement))
router.post(
	'/register',
	regValidate.registrationRules(),
	regValidate.checkRegData,
	utilities.handleErrors(accountController.registerAccount)
)

router.post(
	"/login",
	regValidate.loginRules(),
	regValidate.checklogindata,
	utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;