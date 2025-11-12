// Config/db.js
const pkg = require("pg");
const { Pool } = pkg;
const dotenv = require("dotenv");
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Enable SSL in production (Render)
    : false,                        // Disable SSL for local dev
});

// Test connection
pool.connect()
  .then(() => console.log(`✅ Connected to PostgreSQL Database (${process.env.NODE_ENV})`))
  .catch(err => console.error("❌ DB connection error:", err));

module.exports = pool;
