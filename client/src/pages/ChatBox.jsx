import React, { useEffect, useRef, useState } from "react";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { Image, SendHorizonal } from "lucide-react";

const ChatBox = () => {
  const messages = dummyMessagesData;
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(dummyUserData);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    user && (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-10 py-4 bg-white border-b shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={user.profile_picture}
              alt="User Avatar"
              className="size-11 sm:size-12 rounded-full border-2 border-indigo-500 shadow"
            />
            <div className="leading-snug">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                {user.full_name}
              </h2>
              <p className="text-sm text-slate-500">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-6 md:px-10 py-6">
          <div className="flex flex-col gap-5">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => {
                const isSelf = message.to_user_id === user._id;
                return (
                  <div
                    key={index}
                    className={`flex ${
                      isSelf ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isSelf && (
                      <img
                        src={user.profile_picture}
                        alt="sender"
                        className="size-8 rounded-full mr-2 mt-1"
                      />
                    )}

                    <div
                      className={`rounded-xl px-4 py-2 max-w-[75%] text-sm shadow-md ${
                        isSelf
                          ? "bg-indigo-100 text-slate-800 rounded-br-none"
                          : "bg-white text-slate-700 rounded-bl-none"
                      }`}
                    >
                      {message.message_type === "image" && (
                        <img
                          src={message.media_url}
                          className="w-full max-h-60 object-cover rounded-lg mb-2"
                          alt="uploaded"
                        />
                      )}
                      <p>{message.text}</p>
                    </div>
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="w-full px-2 sm:px-6 md:px-10 py-4">
          <div className="flex items-center w-full bg-white border border-gray-300 shadow-lg rounded-full px-4 py-2 gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <label htmlFor="image" className="cursor-pointer">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="h-8 w-8 rounded object-cover"
                />
              ) : (
                <Image className="size-6 text-gray-400 hover:text-gray-600" />
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
              className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full transition active:scale-95"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ChatBox;
