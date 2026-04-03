const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
})
}

/* ****************************************
*  Deliver registration view
* *************************************** */

async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
        title: "Registration",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */

async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    //Hash the password before storing 

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        req.status(500).render("account/registration", {
            title: "Registration",
            nav,
            errors: null
        })
    }

    const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)

    if (regResult) {
        req.flash("notice", 
    `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
 } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
        title: "Registration",
        nav,
    })
}
}

/* ****************************************
 *  Process login request
 * ************************************ */

async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentails and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 *1000})
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
            } catch (error) {
                throw new Error('Access Forbidden')
            }
            }

/* ****************************************
 *  Deliver account management view
 * ************************************ */

async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors:null
    })
}

/* ****************************************
 *  Deliver account update view
 * ************************************ */

async function buildAccountUpdate(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account-update", {
        title: "Update Account Information",
        nav,
        account_id: res.locals.accountData.account_id,
        account_firstname: res.locals.accountData.account_firstname,
        account_lastname: res.locals.accountData.account_lastname,
        account_email: res.locals.accountData.account_email,
        errors: null
    })
}

/* ****************************************
*  Process Account Update
* *************************************** */

async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_id, account_firstname, account_lastname, account_email } = req.body

    const regResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

    if (regResult && regResult.rowCount) {
        const updatedAccount = regResult.rows[0]
        const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 *1000})
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        req.flash("notice", 
    `Congratulations, you\'ve updated your information, ${account_firstname}.`
    )
    return req.session.save(() => res.redirect("/account/"))
 } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/account-update", {
        title: "Update Account Information",
        nav,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        errors: null,
    })
}
}

/* ****************************************
*  Process Password Change
* *************************************** */

async function changePassword(req, res) {
    let nav = await utilities.getNav()
    const { account_password } = req.body
    const { account_id } = req.body

    //Hash the password before storing 

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the password change.')
        return res.status(500).render("account/account-update", {
            title: "Update Account Information",
            nav,
            account_id: res.locals.accountData.account_id,
            account_firstname: res.locals.accountData.account_firstname,
            account_lastname: res.locals.accountData.account_lastname,
            account_email: res.locals.accountData.account_email,
            errors: null
        })
    }

    const regResult = await accountModel.changePassword(account_id, hashedPassword)

    if (regResult && regResult.rowCount) {
        req.flash("notice", 
    `Congratulations, you\'ve updated your password, ${res.locals.accountData.account_firstname}. Please log in with your new password.`
    )
    res.clearCookie("jwt")
    res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
 } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/account-update", {
        title: "Update Account Information",
        nav,
        account_id: res.locals.accountData.account_id,
        account_firstname: res.locals.accountData.account_firstname,
        account_lastname: res.locals.accountData.account_lastname,
        account_email: res.locals.accountData.account_email,
        errors: null
    })
}
}

/* ****************************************
*  Logout to homepage
* *************************************** */

async function logout(req, res) {
    res.clearCookie("jwt")
    res.locals.loggedin = 0
    res.locals.accountData = null
    req.flash("notice", "You have been logged out.")
    return req.session.save(() => res.redirect("/"))
}

module.exports = {buildLogin, buildRegistration, registerAccount, accountLogin, buildAccountManagement, buildAccountUpdate, updateAccount, changePassword, logout}