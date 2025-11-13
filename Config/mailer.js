const nodemailer = require("nodemailer");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

let transporter;

if (isProduction) {
  // 🟢 Production - Gmail (Aekads)
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kartikchaudhari639@gmail.com",
      pass: "blhaizioolxakizz", // Gmail app password
    },
  });
} else {
  // 🟢 Localhost - .env settings
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
