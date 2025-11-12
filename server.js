// server.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const contactRoutes = require("./Routes/contactRoute");
require("dotenv").config();
require("./Config/db"); // Ensure DB connection

const app = express();

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

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
