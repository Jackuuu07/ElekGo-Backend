// models/contactModel.js
const pool = require("../Config/db");

class Contact {
  static async create({ name, email, message }) {
    const query = `
      INSERT INTO contacts (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING id, created_at;
    `;
    const values = [name, email, message];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
    return result.rows;
  }
}

module.exports = Contact;
