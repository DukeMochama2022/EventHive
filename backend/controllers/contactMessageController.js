const ContactMessage = require("../models/ContactMessage");

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const newMessage = await ContactMessage.create({ name, email, message });
    res
      .status(201)
      .json({
        success: true,
        message: "Message sent successfully!",
        data: newMessage,
      });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message." });
  }
};

exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
};
