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
    const classificationManagementList = await utilities.buildClassificationManagementList()
    res.render("./inventory/management", {
        title: "Vehicle Management View",
        nav,
        management,
        classificationSelect,
        classificationManagementList,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */

invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
    }

/* ***************************
 *  Deliver Edit Inventory View
 * ************************** */

invCont.buildEditInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id)
    const invData = await invModel.getDetailsByInventoryId(inv_id)
    let invName = `${invData[0].inv_make} ${invData[0].inv_model}`
    const classificationList = await utilities.buildClassificationList(invData[0].classification_id)
    
    res.render("./inventory/edit-inventory", {
        title: "Edit " + invName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id: inv_id,
        inv_make: invData[0].inv_make,
        inv_model: invData[0].inv_model,
        inv_year: invData[0].inv_year,
        inv_description: invData[0].inv_description,
        inv_image: invData[0].inv_image,
        inv_thumbnail: invData[0].inv_thumbnail,
        inv_price: invData[0].inv_price,
        inv_miles: invData[0].inv_miles,
        inv_color: invData[0].inv_color,
        classification_id: invData[0].classification_id
    })
}

/* ****************************************
*  Process Update New Inventory Item
* *************************************** */

invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,} = req.body
    const updateResult = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (updateResult) {
        req.flash("notice", `The ${updateResult.inv_make} ${updateResult.inv_model} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id)
        const invName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("./inventory/edit-inventory", {
            title: "Edit " + invName,
            nav: await utilities.getNav(),
            classificationList: classificationList,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        })
    }
}

/* ***************************
 *  Build and Deliver Inventory Delete Confirmation View
 * ************************** */

invCont.buildDeleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id)
    const invData = await invModel.getDetailsByInventoryId(inv_id)
    let invName = `${invData[0].inv_make} ${invData[0].inv_model}`
    const classificationList = await utilities.buildClassificationList(invData[0].classification_id)
    
    res.render("./inventory/delete-confirm", {
        title: "Confirm Deletion of " + invName,
        nav,
        errors: null,
        inv_id: inv_id,
        inv_make: invData[0].inv_make,
        inv_model: invData[0].inv_model,
        inv_year: invData[0].inv_year,
        inv_price: invData[0].inv_price,
    })
}

/* ****************************************
*  Process Delete Inventory Item
* *************************************** */

invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.body.inv_id)
    const inv_make = req.body.inv_make
    const inv_model = req.body.inv_model
    const inv_year = req.body.inv_year
    const inv_price = req.body.inv_price
    const deleteResult = await invModel.deleteInventoryItem(inv_id)
    if (deleteResult) {
        req.flash("notice", `The ${inv_make} ${inv_model} was successfully deleted.`)
        res.redirect("/inv/")
    } else {
        const invName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("./inventory/delete-confirm", {
            title: "Confirm Deletion of " + invName,
            nav: await utilities.getNav(),
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
        })
    }
}

/* ****************************************
*  Build and Deliver Classification Delete Confirmation View
* *************************************** */

invCont.buildDeleteClassification = async function(req, res, next) {
    let nav = await utilities.getNav()
    const classification_id = parseInt(req.params.classification_id)
    const classificationData = await invModel.getClassificationById(classification_id)
    
    if(!classificationData) {
        req.flash("notice", "The Classification was not found.")
        res.redirect("/inv/")
    }

    res.render("./inventory/delete-classification-confirm", {
        title: `Confirm Deletion of ${classificationData.classification_name} Classification`,
        nav,
        errors: null,
        classification_id: classificationData.classification_id,
        classification_name: classificationData.classification_name,
    })
}

/* ****************************************
*  Process Delete Classification
* *************************************** */

invCont.deleteClassification = async function (req, res, next) {
    const classification_id = parseInt(req.body.classification_id)
    const classificationData = await invModel.getClassificationById(classification_id)

    if(!classificationData) {
        req.flash("notice", "The Classification was not found.")
        res.redirect("/inv/")
    }

    const inventoryCount = await invModel.countInventoryByClassificationId(classification_id)

    if (inventoryCount > 0) {
        req.flash("notice", `You cannot delete the ${classificationData.classification_name} classification because there is still inventory assigned. Please delete or reassign all inventory items before deleting this classification.`)
        res.redirect("/inv/")
    }

    const deleteResult = await invModel.deleteClassificationById(classification_id)
    if (deleteResult) {
        req.flash("notice", `The ${classificationData.classification_name} classification was succesfully deleted.`)
        res.redirect("/inv/")
    }
    else {
        req.flash("notice", "Sorry, the classification delete failed.")
        res.redirect("/inv/")
    }
}


module.exports = invCont;

