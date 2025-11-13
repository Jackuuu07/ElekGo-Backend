// config/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

let transporter;

// 🟢 Use Gmail App Password on Render (production)
if (isProduction) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER, // your Gmail address
      pass: process.env.SMTP_PASS, // your Gmail app password
    },
  });
} else {
  // 🟢 Localhost settings (same as your working config)
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer connection failed:", error);
  } else {
    console.log("📧 Mailer connected successfully!");
  }
});

module.exports = transporter;
