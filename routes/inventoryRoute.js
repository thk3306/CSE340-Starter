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
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//Route for editing inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))
//Route for updating inventory
router.post("/update/", invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
//Route for deleting inventory
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))

router.post('/add-classification', invValidate.classificationRules(), invValidate.checkaddClassificationData, utilities.handleErrors(invController.addClassification))
router.post('/add-inventory', invValidate.inventoryRules(), invValidate.checkAddInventoryData, utilities.handleErrors(invController.addInventory))

module.exports = router;