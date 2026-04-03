const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities')
const invValidate = require('../utilities/inventory-validation')

router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId))
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvId))
router.get('/trigger-error', utilities.handleErrors(invController.throwIntentionalError))
router.get('/', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildManagementView))
router.get('/add-classification', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildAddClassification))
router.get('/add-inventory', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildAddInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//Route for editing inventory view
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildEditInventory))
//Route for updating inventory
router.post("/update/", utilities.checkLogin, utilities.checkpermissions, invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
//Route for delivering the delete inventory confirmation view
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildDeleteInventory))
//Route for processing the delete inventory request
router.post('/delete/', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.deleteInventory))

router.post('/add-classification', utilities.checkLogin, utilities.checkpermissions, invValidate.classificationRules(), invValidate.checkaddClassificationData, utilities.handleErrors(invController.addClassification))
router.post('/add-inventory', utilities.checkLogin, utilities.checkpermissions, invValidate.inventoryRules(), invValidate.checkAddInventoryData, utilities.handleErrors(invController.addInventory))

module.exports = router;