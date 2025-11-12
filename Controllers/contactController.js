// controllers/contactController.js
const Contact = require("../Models/contactModel");
const transporter = require("../Config/mailer");

exports.addContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1️⃣ Save to database
    const newContact = await Contact.create({ name, email, message });

    // 2️⃣ Prepare and send email
    const mailOptions = {
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📨 New Contact Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
        <hr/>
        <p><i>Received at: ${newContact.created_at}</i></p>
      `,
    };
    // Send thank-you email to user
    const userMail = {
    from: `"Elekgo Technologies" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Thank you for contacting us!",
    html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out! We have received your message and will respond shortly.</p>
        <br/>
        <p>Best regards,<br>Elekgo Technologies Team</p>
    `,
    };

    await transporter.sendMail(userMail);


    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Contact saved and email sent successfully.",
      data: newContact,
    });
  } catch (error) {
    console.error("Error processing contact:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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
