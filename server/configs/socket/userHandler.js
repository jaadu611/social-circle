import Message from "../../models/message.model.js";

let onlineUsers = {};

export const socketHandlers = (io, socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);

    onlineUsers[userId] = socket.id;

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  // Send a message
  socket.on("sendMessage", async (message) => {
    if (!message || !message.from_user_id || !message.to_user_id) {
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

      // Emit message to both sender and receiver
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

  // Handle disconnect
  socket.on("disconnect", () => {
    let disconnectedUserId = null;
    for (const [userId, id] of Object.entries(onlineUsers)) {
      if (id === socket.id) {
        disconnectedUserId = userId;
        delete onlineUsers[userId];
        break;
      }
    }
    if (disconnectedUserId) {
      io.emit("onlineUsers", Object.keys(onlineUsers));
    }
  });
};
