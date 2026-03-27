const utilities = require('.')
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .withMessage("Please provide a valid classification name with only letters."),
  ]
}

/* ******************************
 * Check classification data and return errors or continue
 * ***************************** */

validate.checkaddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */

validate.inventoryRules = () => {
  const imagePathPattern = /^\/?images\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|gif)$/i
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2, max: 100 })
      .withMessage("Please provide an inventory make between 2 and 100 characters."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2, max: 255 })
      .withMessage("Please provide a model between 2 and 255 characters."),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),
    body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2, max: 255 })
        .withMessage("Please provide a description between 2 and 255 characters."),
    body("inv_image")
        .trim()
        .notEmpty()
      .matches(imagePathPattern)
      .withMessage("Please provide a valid image path (example: /images/vehicles/no-image.png)."),
    body("inv_thumbnail")
        .trim()
        .notEmpty()
      .matches(imagePathPattern)
      .withMessage("Please provide a valid thumbnail path (example: /images/vehicles/no-image.png)."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide a valid mileage."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2, max: 100 })
      .withMessage("Please provide a valid color between 2 and 100 characters.")
  ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */

validate.checkAddInventoryData = async (req, res, next) => {
  const {
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
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Vehicle Inventory",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate
