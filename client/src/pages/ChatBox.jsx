import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import { Image, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../api/axios";
import {
  addMessages,
  resetMessages,
  setMessages,
} from "../features/messagesSlice";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { SocketContext } from "../App.jsx";

const ChatBox = () => {
  const { messages } = useSelector((state) => state.messages);
  const connections = useSelector((state) => state.connections.connections);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { getToken, isLoaded } = useAuth();
  const { user: currentUser } = useUser();
  const socket = useContext(SocketContext);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false); // track lazy load
  const messagesEndRef = useRef(null);

  const chatUser = useMemo(
    () => connections.find((c) => c._id === userId) || null,
    [connections, userId]
  );

  const isChatUserOnline = chatUser && onlineUsers.includes(chatUser._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Lazy fetch chat messages after component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        const { data } = await api.post(
          "/api/message/get",
          { to_user_id: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          dispatch(resetMessages());
          dispatch(setMessages(data.messages));
          setMessagesLoaded(true); // mark loaded
        }
      } catch (err) {
        toast.error("Failed to fetch messages");
        console.error(err);
      }
    };
    // defer fetch slightly to avoid blocking render
    const timer = setTimeout(fetchMessages, 0);
    return () => clearTimeout(timer);
  }, [userId, isLoaded, getToken, dispatch]);

  // Track online users via socket
  useEffect(() => {
    if (!socket) return;
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    socket.on("onlineUsers", handleOnlineUsers);
    return () => socket.off("onlineUsers", handleOnlineUsers);
  }, [socket]);

  // Send message
  const sendMessage = async () => {
    if (!text && !image) return;
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("to_user_id", userId);
      formData.append("from_user_id", currentUser.id);
      formData.append("text", text);
      formData.append("message_type", image ? "image" : "text");
      if (image) formData.append("image", image);

      const { data } = await api.post("/api/message/send", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setText("");
        setImage(null);
        socket?.emit("sendMessage", data.message);
      }
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
    }
  };

  // Socket listeners: join and receive messages
  useEffect(() => {
    if (!socket || !currentUser || !messagesLoaded) return;
    socket.emit("join", currentUser.id);

    const handleReceiveMessage = (message) => dispatch(addMessages(message));
    const handleUpdateSeen = ({ messageIds }) =>
      dispatch(
        setMessages(
          messages.map((msg) =>
            messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
          )
        )
      );

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("updateSeen", handleUpdateSeen);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("updateSeen", handleUpdateSeen);
    };
  }, [socket, dispatch, messages, currentUser, messagesLoaded]);

  useEffect(() => {
    if (!socket || !chatUser) return;
    const unseenMessages = messages.filter(
      (msg) => !msg.seen && msg.from_user_id === chatUser._id
    );
    if (unseenMessages.length > 0) {
      socket.emit("markSeen", {
        from_user_id: chatUser._id,
        to_user_id: currentUser.id,
      });
    }
  }, [messages, chatUser, currentUser, socket]);

  const sortedMessages = useMemo(
    () =>
      messages
        .flat()
        .filter(Boolean)
        .sort(
          (a, b) =>
            new Date(a.createdAt || Date.now()) -
            new Date(b.createdAt || Date.now())
        ),
    [messages]
  );

  if (!isLoaded || !currentUser || !chatUser) return <Loading />;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-300 sticky top-0 z-10">
        <img
          src={chatUser.profile_picture}
          alt="User Avatar"
          className="h-11 w-11 rounded-full border-2 border-indigo-500"
          loading="lazy"
        />
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {chatUser.full_name}
            <span
              className={`h-2 w-2 rounded-full inline-block ${
                isChatUserOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </h2>
          <p className="text-sm text-gray-500">@{chatUser.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {sortedMessages.map((message, idx) => {
          if (!message?.from_user_id) return null;
          const isSelf =
            (message.from_user_id._id || message.from_user_id) ===
            currentUser.id;
          return (
            <div
              key={idx}
              className={`flex ${
                isSelf ? "justify-end items-end" : "justify-start items-end"
              }`}
            >
              {!isSelf && (
                <img
                  src={chatUser.profile_picture}
                  alt="sender"
                  className="h-8 w-8 rounded-full mr-2 mt-1 object-cover"
                  loading="lazy"
                />
              )}
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`rounded-xl px-4 py-2 text-sm shadow break-words ${
                    isSelf
                      ? "bg-gradient-to-tr from-indigo-500 via-blue-500 to-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.message_type === "image" && message.media_url && (
                    <img
                      src={message.media_url}
                      alt="uploaded"
                      className="w-full max-h-60 object-cover rounded-lg my-2"
                      loading="lazy"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                  {isSelf && message.seen && (
                    <span className="text-xs text-gray-400 mt-1">Seen</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-300 flex items-center gap-3 sticky bottom-0">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 text-sm outline-none px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <label htmlFor="image" className="cursor-pointer">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="h-10 w-10 rounded object-cover"
              loading="lazy"
            />
          ) : (
            <Image className="h-6 w-6 text-gray-400" />
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
        <button
          onClick={sendMessage}
          className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full flex items-center justify-center"
        >
          <Send size={18} className="relative -bottom-[0.5px] -left-[0.5px]" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
