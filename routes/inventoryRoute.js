const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities')
const invValidate = require('../utilities/inventory-validation')

router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId))
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvId))
router.get('/trigger-error', utilities.handleErrors(invController.throwIntentionalError))
//Route for delivering the inventory management view
router.get('/', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildManagementView))
//Route for delivering the add classification view
router.get('/add-classification', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildAddClassification))
//Route for delivering the add inventory view
router.get('/add-inventory', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildAddInventory))
//Route for fetching inventory items by classification id in JSON format for dynamic inventory management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//Route for editing inventory view
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildEditInventory))
//Route for updating inventory
router.post("/update/", utilities.checkLogin, utilities.checkpermissions, invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
//Route for delivering the delete inventory confirmation view
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildDeleteInventory))
//Route for processing the delete inventory request
router.post('/delete/', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.deleteInventory))
//Route for delivering the modify classification view
router.get('/modify-classification/:classification_id', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildModifyClassification))
//Route for processing the modify classificaiton request
router.post('/modify-classification/', utilities.checkLogin, utilities.checkpermissions, invValidate.classificationRules(), invValidate.checkaddClassificationData, utilities.handleErrors(invController.modifyClassification))
//Route for delivering the delete classification confirmation view
router.get('/delete-classification/:classification_id', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.buildDeleteClassification))
//Route for processing the delete classification request
router.post('/delete-classification/', utilities.checkLogin, utilities.checkpermissions, utilities.handleErrors(invController.deleteClassification))
//Route for processing the add classification request
router.post('/add-classification', utilities.checkLogin, utilities.checkpermissions, invValidate.classificationRules(), invValidate.checkaddClassificationData, utilities.handleErrors(invController.addClassification))
//Route for processing the add inventory request
router.post('/add-inventory', utilities.checkLogin, utilities.checkpermissions, invValidate.inventoryRules(), invValidate.checkAddInventoryData, utilities.handleErrors(invController.addInventory))

module.exports = router;