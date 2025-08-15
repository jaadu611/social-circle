import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const { getToken, isLoaded } = useAuth();
  const { user } = useUser();

  const fetchRecentsMessages = async () => {
    if (!isLoaded || !user) return;
    try {
      const token = await getToken();
      const { data } = await api.get("/api/message/recent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch recent messages");
    }
  };

  useEffect(() => {
    fetchRecentsMessages();
  }, [isLoaded, user]);

  return (
    <div className="bg-white max-w-lg p-5 min-h-24 rounded-xl shadow-md text-sm text-slate-800 w-full">
      <h3 className="font-semibold text-base text-slate-800 mb-4">
        Recent Messages
      </h3>
      <div className="flex flex-col max-h-64 overflow-y-auto no-scrollbar divide-y divide-slate-100">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${
              message.from_user_id._id === user.id
                ? message.to_user_id._id
                : message.from_user_id._id
            }`}
            key={index}
            className="flex items-start gap-3 py-3 px-2 hover:bg-slate-50 transition rounded-lg"
          >
            <img
              src={
                message.from_user_id._id === user.id
                  ? message.to_user_id.profile_picture
                  : message.from_user_id.profile_picture
              }
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-[15px]">
                  {message.from_user_id._id === user.id
                    ? message.to_user_id.full_name
                    : message.from_user_id.full_name}
                </p>
                <p className="text-[11px] text-slate-400 whitespace-nowrap">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>
              <div className="flex justify-between items-center gap-2 mt-1">
                <p
                  className={`truncate ${
                    message.seen
                      ? "text-gray-500"
                      : "font-semibold text-gray-800"
                  } max-w-[200px]`}
                >
                  {message.text
                    ? message.text
                    : `${
                        message.from_user_id._id === user.id
                          ? message.to_user_id.full_name
                          : message.from_user_id.full_name
                      } sent a message`}
                </p>
                {!message.seen && (
                  <span className="bg-indigo-500 text-white w-5 h-5 flex justify-center items-center rounded-full text-[10px] font-bold">
                    1
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
