import Message from "../../models/message.model.js";

export const socketHandlers = (io, socket) => {
  // Join a user room
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  // Send a message
  socket.on("sendMessage", async (message) => {
    if (!message || !message.from_user_id || !message.to_user_id) {
      console.warn("Received invalid message:", message);
      return;
    }

    try {
      const receiverId =
        typeof message.to_user_id === "object"
          ? message.to_user_id._id
          : message.to_user_id;

      const senderId =
        typeof message.from_user_id === "object"
          ? message.from_user_id._id
          : message.from_user_id;

      io.to(receiverId).emit("receiveMessage", message);
      io.to(senderId).emit("receiveMessage", message);
    } catch (err) {
      console.error("Socket sendMessage error:", err);
    }
  });

  // Mark messages as seen
  socket.on("markSeen", async ({ from_user_id, to_user_id }) => {
    try {
      const updatedMessages = await Message.updateMany(
        { from_user_id, to_user_id, seen: false },
        { seen: true },
        { new: true }
      );

      const messageIds = updatedMessages.map((msg) => msg._id);
      io.to(from_user_id).emit("updateSeen", { messageIds });
    } catch (err) {
      console.error("Error marking messages as seen:", err);
    }
  });
};
