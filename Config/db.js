// Config/db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Required for Render PostgreSQL
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "contact_db",
        password: process.env.DB_PASSWORD || "postgres",
        port: process.env.DB_PORT || 5432,
        ssl: false,
      }
);

// Test connection
pool
  .connect()
  .then(() =>
    console.log(
      `✅ Connected to PostgreSQL Database (${process.env.NODE_ENV || "development"})`
    )
  )
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = pool;
