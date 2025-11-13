// server.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const contactRoutes = require("./Routes/contactRoute");
require("dotenv").config();
require("./Config/db"); // Ensure DB connection

const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());


// Middlewares
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000", // change for your frontend
}));
app.use(express.json());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // requests per minute per IP
  })
);

// Routes
app.use("/api/contact", contactRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Contact Form API running...");
});



// ======= CONTACT FORM API =======
app.post("/api/contact/test", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required" });

  try {
    // Create transporter (using your credentials directly)
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "anything@example.com",
        pass: process.env.BREVO_SMTP_KEY, // from Render env var
      },
    });


    // Define mail details
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "kartikchaudhari639@gmail.com", // receiver
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>📩 New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "✅ Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending mail:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});





// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





