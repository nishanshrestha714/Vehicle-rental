import ContactMessage from "../Models/contact.message.js";

// Send a new contact message
const sendMessage = async (req, res) => {
  try {
    const { name, email, phoneNumber, message } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const addMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: addMessage,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get all messages for admin
const getAllMessage = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    if (!messages || messages.length === 0) {
      return res.status(404).json({ error: "No messages found" });
    }

    return res.status(200).json({
      message: "Messages retrieved successfully",
      messages,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a message by ID
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMessage = await ContactMessage.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { sendMessage, getAllMessage, deleteMessage };