const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities')
const invValidate = require('../utilities/inventory-validation')

router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId))
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvId))
router.get('/trigger-error', utilities.handleErrors(invController.throwIntentionalError))
router.get('/', utilities.handleErrors(invController.buildManagementView))
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification))
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory))
router.post('/add-classification', invValidate.classificationRules(), invValidate.checkaddClassificationData, utilities.handleErrors(invController.addClassification))
router.post('/add-inventory', invValidate.inventoryRules(), invValidate.checkAddInventoryData, utilities.handleErrors(invController.addInventory))

module.exports = router;