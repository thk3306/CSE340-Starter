const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */

async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */

async function getInventoryByClassificationId(classification_id){
    try {
        const data = await pool.query(`SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1`, [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

async function getDetailsByInventoryId(inventory_id){
    try {
        const data = await pool.query(`SELECT * FROM public.inventory WHERE inv_id = $1`,
        [inventory_id]
        )
        return data.rows
    } catch (error) {
        console.error("getDetailsByInventoryId error " + error)
    }
}

/* ***************************
 *  Add new classification
 * ************************** */

async function addClassification
(classification_name){
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Add new inventory item
 * ************************** */

async function addInventoryItem(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try {
        const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
    } catch (error) {
        return error.message
    }
}


/* ***************************
 *  Update inventory item
 * ************************** */

async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try {
        const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
        const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ***************************
 *  Delete inventory item
 * ************************** */

async function deleteInventoryItem(inv_id){
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1 RETURNING *";
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
       new Error("Delete Inventory Error")
    }
}

/* ***************************
 *  Get classification by Id
 * ************************** */

async function getClassificationById(classification_id) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_id = $1";
        const data = await pool.query(sql, [classification_id]);
        return data.rows[0]
    } catch (error) {
        console.error("getClassificationById error: " + error)
    }
}

/* ***************************
 *  Count inventory items in classification
 * ************************** */

async function countInventoryByClassificationId(classification_id) {
    try {
        const sql = "SELECT COUNT(*)::int AS total FROM inventory WHERE classification_id = $1";
        const data = await pool.query(sql, [classification_id])
        return data.rows[0].total
    } catch (error) {
        console.error("countInventoryByClassificationId error " +error)
    }
    }

/* ***************************
 *  Delete Classification by ID
 * ************************** */

async function deleteClassificationById(classification_id) {
    try {
        const sql = "DELETE FROM classification WHERE classification_id = $1 RETURNING *";
        const data = await pool.query(sql, [classification_id])
        return data.rows[0]
    } catch (error) {
        console.error("deleteClassificationById error " + error)
    }
}

/* ***************************
 *  Get classifcations with inventory count
 * ************************** */

async function getClassificationWithInventoryCount() {
    try {
        const sql = `SELECT c.classification_id, c.classification_name, COUNT(i.inv_id)::int AS inventory_total FROM classification c LEFT JOIN inventory i ON c.classification_id = i.classification_id GROUP BY c.classification_id, c.classification_name`;
        const data = await pool.query(sql);
        return data.rows;
    } catch (error) {
        console.error("getClassificationWithInventoryCount error " + error);
    }
}


module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByInventoryId, addClassification, addInventoryItem, updateInventory, deleteInventoryItem, getClassificationById, countInventoryByClassificationId, deleteClassificationById, getClassificationWithInventoryCount}

