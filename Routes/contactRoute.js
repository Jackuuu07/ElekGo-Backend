// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../Controllers/contactController");
const { validateContact } = require("../Middlewares/validation");

// Add a new contact
router.post("/", validateContact, contactController.addContact);

// Get all contacts
router.get("/", contactController.getAllContacts);

module.exports = router;
