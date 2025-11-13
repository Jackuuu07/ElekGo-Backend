// controllers/contactController.js
const Contact = require("../Models/contactModel");
const transporter = require("../Config/mailer");
const db = require("../Config/db");

exports.addContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    // 🟢 1️⃣ Save to PostgreSQL (common for both environments)
    await db.query(
      `INSERT INTO  contacts (name, email, message)
       VALUES ($1, $2, $3)`,
      [name, email, message]
    );

    // 🟢 2️⃣ Email settings differ based on environment
    const isProduction = process.env.NODE_ENV === "production";

    let mailOptions;
    if (isProduction) {
      // === Production on Render ===
      mailOptions = {
        from: email,
        to: ["kartikc1348@gmail.com"], // Receiver for production
        subject: "🔔 New Lead Alert: Contact Form Submission",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; color: #333;">
              <div style="max-width: 600px; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                  <h2 style="color: #0073e6; text-align: center;">📩 New Lead Notification</h2>
                  <p style="font-size: 16px;">You have received a new inquiry from your contact form.</p>
                  <hr style="border: 1px solid #ddd;">
                  <h3 style="color: #333;">👤 Contact Details:</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #0073e6;">${email}</a></p>
                  <hr style="border: 1px solid #ddd;">
                  <h3 style="color: #333;">💬 Message:</h3>
                  <p style="font-style: italic; background-color: #f9f9f9; padding: 10px; border-radius: 5px;">${message}</p>
                  <hr style="border: 1px solid #ddd;">
                  <p style="text-align: center; font-size: 14px; color: #888;">
                      📅 Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </p>
              </div>
          </div>
        `,
      };
    } else {
      // === Local Development ===
      mailOptions = {
        from: `"Contact Form" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `📨 New Contact Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b><br>${message}</p>
          <hr/>
          <p><i>Received at: ${new Date().toLocaleString()}</i></p>
        `,
      };
    }

    // 🟢 3️⃣ Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message sent and saved successfully!" });
  } catch (error) {
    console.error("Error processing contact:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};


exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
