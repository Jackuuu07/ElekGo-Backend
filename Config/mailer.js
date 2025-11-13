// config/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

// Configure transporter for local vs production
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: isProduction ? 465 : parseInt(process.env.SMTP_PORT) || 587, // 465 for Render
  secure: isProduction ? true : false, // true for port 465 (SSL), false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // app password for Gmail
  },
  tls: {
    rejectUnauthorized: false, // required on some cloud servers
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer connection failed:", error);
  } else {
    console.log("📧 Mailer connected successfully!");
  }
});

module.exports = transporter;
