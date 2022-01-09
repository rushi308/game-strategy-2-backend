// Get the functions in the db.js file to use
const db = require('../services/db');
const bcrypt = require("bcryptjs");
class User {

    // Id of the user
    id;

    // Email of the user
    email;

    constructor(email) {
        this.email = email;
    }

    // Get an existing user id from an email address, or return false if not found
    async getIdFromEmail() {
        var sql = "SELECT id FROM Users WHERE Users.email = ?";
        const result = await db.query(sql, [this.email]);
        // TODO LOTS OF ERROR CHECKS HERE..
        if (JSON.stringify(result) != '[]') {
            this.id = result[0].id;
            return this.id;
        }
        else {
            return false;
        }

    }

    // Add a password to an existing user
    async setUserPassword(password) {
        const pw = await bcrypt.hash(password, 10);
        var sql = "UPDATE users SET password = ? WHERE users.id = ?"
        const result = await db.query(sql, [pw, this.id]);
        return true;
    }

    // Add a new record to the users table    
    async addUser(data) {
        data.password = await bcrypt.hash(data.password, 10);
        var sql = `INSERT INTO users (username, firstName, lastName, email, mobile, password) 
        VALUES ('${data.username}', '${data.firstName}', '${data.lastName}', '${data.email}', '${data.mobile}', '${data.password}')`;
        const result = await db.query(sql);
        this.id = result.insertId;
        return true;
    }

    async changeProfile(data, id) {
        var sql = `UPDATE users SET firstName= '${data.firstName}',lastName ='${data.lastName}' ,mobile ='${data.mobile}'
        WHERE id = ${id}`;
        const result = await db.query(sql);
        return result;
    }


    async login(data) {
        var sql = "SELECT * FROM users WHERE email = ?";
        const result = await db.query(sql, [data.email]);
        const match = await bcrypt.compare(data.password, result[0].password);
        return { isAuthorized: match, user: result[0] }
    }

    // Test a submitted password against a stored password
    async authenticate(submitted) {

        // Get the stored, hashed password for the user
        var sql = "SELECT password FROM users WHERE id = ?";
        const result = await db.query(sql, [this.id]);
        const match = await bcrypt.compare(submitted, result[0].password);
        if (match == true) {
            return true;
        }
        else {
            return false;
        }
    }

    async getUserDetail(id) {
        var sql = `SELECT * FROM Users WHERE id=${id}`
        const result = await db.query(sql);
        return result ? result[0] : {};
    }


}

module.exports = {
    User
}