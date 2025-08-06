import React from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Page Title */}
      <div className="shrink-0 px-4 py-6 sm:px-6 lg:px-8 text-center bg-white z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
          Messages
        </h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg">
          Talk to your friends and family
        </p>
      </div>

      {/* Scrollable Grid */}
      <div className="flex-1 bg-white overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid custom-cols-messages gap-4 sm:gap-5 md:gap-6">
          {dummyConnectionsData.map((user) => (
            <div
              key={user._id}
              className="flex flex-col items-center hover:ring-2 hover:ring-purple-400 justify-between text-center bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group"
            >
              <img
                src={user.profile_picture}
                alt={user.full_name}
                className="rounded-full size-12 sm:size-14 md:size-16 object-cover mb-2 sm:mb-3 shadow group-hover:ring-4 group-hover:ring-purple-400 transition duration-300"
              />
              <div className="space-y-0.5 sm:space-y-1">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 group-hover:text-purple-600 transition">
                  {user.full_name}
                </p>
                {user.username && (
                  <p className="text-slate-500 text-xs sm:text-sm">
                    @{user.username}
                  </p>
                )}
              </div>
              {user.bio && (
                <p className="hidden lg:block text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 line-clamp-3">
                  {user.bio}
                </p>
              )}
              <div className="flex gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-5">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white active:scale-95 transition duration-200"
                >
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-600 hover:text-white active:scale-95 transition duration-200"
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
