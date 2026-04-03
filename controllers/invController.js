const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getDetailsByInventoryId(inv_id)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
        title: data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model,
        nav,
        detail: await utilities.buildDetailView(data)
    })

}

/* ***************************
 *  Deliver management view
 * ************************** */

invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const management = await utilities.buildManagementView()
    res.render("./inventory/management", {
        title: "Vehicle Management View",
        nav,
        management,
        classificationSelect,
        errors: null
    })
}

/* ***************************
 *  Deliver Add New Classification View
 * ************************** */

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Vehicle Classification",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Add New Classification
* *************************************** */

invCont.addClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const addResult = await invModel.addClassification(classification_name)
    if (addResult) {
        req.flash("notice", `Congratulations, you added ${classification_name}`)
        res.status(201).render("./inventory/add-classification", {
            title: "Add New Vehicle Classification",
            nav: await utilities.getNav(),
            errors: null
        })
    } else {
        req.flash("error", "Failed to add classification")
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Vehicle Classification",
            nav: await utilities.getNav(),
            errors: null
        })
    }
}

/* ****************************************
*  Deliver Add New Inventory View
* *************************************** */

invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle Inventory",
        nav,
        classificationList,
        errors: null
    })
}

/* ****************************************
*  Process Add New Inventory Item
* *************************************** */

invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const addResult = await invModel.addInventoryItem(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (addResult) {
        req.flash("notice", `Congratulations, you added a new vehicle`)
        res.status(201).render("./inventory/add-inventory", {
            title: "Add New Vehicle Inventory",
            nav: await utilities.getNav(),
            classificationList: await utilities.buildClassificationList(),
            errors: null
        })
    } else {
        req.flash("error", "Failed to add inventory item")
        res.status(501).render("./inventory/add-inventory", {
            title: "Add New Vehicle Inventory",
            nav: await utilities.getNav(),
            classificationList: await utilities.buildClassificationList(),
            errors: null
        })
    }
}

/* ***************************
 *  Trigger intentional 500 error
 * ************************** */
invCont.throwIntentionalError = async function (req, res, next) {
    const err = new Error("Intentional server error")
    err.status = 500
    throw err
}

module.exports = invCont;

