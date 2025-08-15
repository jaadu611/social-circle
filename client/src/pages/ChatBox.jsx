import React, { useEffect, useRef, useState, useContext } from "react";
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
  const [chatUser, setChatUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat messages
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
        }
      } catch (err) {
        toast.error("Failed to fetch messages");
        console.error(err);
      }
    };
    fetchMessages();
  }, [userId, isLoaded, getToken, dispatch]);

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
        socket.emit("sendMessage", data.message);
      }
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
    }
  };

  // Get chat user info
  useEffect(() => {
    if (connections.length > 0) {
      const foundUser = connections.find((c) => c._id === userId);
      setChatUser(foundUser);
    }
  }, [connections, userId]);

  // Socket listener for incoming messages
  useEffect(() => {
    if (!socket) return;
    socket.emit("join", currentUser.id);

    const handleReceiveMessage = (message) => {
      dispatch(addMessages(message));
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [socket, currentUser.id, dispatch]);

  if (!isLoaded || !currentUser || !chatUser) return <Loading />;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-300 sticky top-0 z-10">
        {chatUser && (
          <img
            src={chatUser.profile_picture}
            alt="User Avatar"
            className="h-11 w-11 rounded-full border-2 border-indigo-500"
          />
        )}
        <div>
          <h2 className="text-lg font-semibold">{chatUser.full_name}</h2>
          <p className="text-sm text-gray-500">@{chatUser.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages
          .flat()
          .filter(Boolean)
          .sort(
            (a, b) =>
              new Date(a.createdAt || Date.now()) -
              new Date(b.createdAt || Date.now())
          )
          .map((message, idx) => {
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
                {!isSelf && chatUser && (
                  <img
                    src={chatUser.profile_picture}
                    alt="sender"
                    className="h-8 w-8 rounded-full mr-2 mt-1 object-cover"
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
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
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
