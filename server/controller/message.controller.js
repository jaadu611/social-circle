import imagekit from "../configs/imagekit.js";
import Message from "../models/message.model.js";

export const sendMessageSocket = (io, message) => {
  try {
    const receiverId =
      message.to_user_id._id?.toString?.() || message.to_user_id;
    const senderId =
      message.from_user_id._id?.toString?.() || message.from_user_id;

    // Send to receiver
    io.to(receiverId).emit("receiveMessage", message);

    // Send to sender too (so sender chat updates instantly)
    io.to(senderId).emit("receiveMessage", message);
  } catch (error) {
    console.error("Error broadcasting message via socket:", error);
  }
};

// Get all chat messages between two users
export const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;

    const messages = await Message.find({
      $or: [
        { from_user_id: userId, to_user_id },
        { from_user_id: to_user_id, to_user_id: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("from_user_id to_user_id");

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat messages",
      error: error.message,
    });
  }
};

// Send message (with optional ImageKit upload)
export const sendMessage = async (req, res) => {
  try {
    const { to_user_id, from_user_id, text, message_type } = req.body;
    let media_url = "";

    // If a file is attached, upload to ImageKit
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer, // Buffer from multer
        fileName: req.file.originalname,
        folder: "social circle chats"
      });
      media_url = uploadResponse.url;
    }

    // Save message in DB
    let message = await Message.create({
      to_user_id,
      from_user_id,
      text,
      media_url,
      message_type,
    });

    // Populate sender and receiver so socket gets complete object
    message = await message.populate("from_user_id to_user_id");

    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

