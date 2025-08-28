import React, { useMemo } from "react";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Messages = () => {
  const { connections } = useSelector((state) => state.connections);
  const navigate = useNavigate();

  // Memoize connection cards to prevent unnecessary re-renders
  const connectionCards = useMemo(
    () =>
      connections.map((user) => (
        <div
          key={user._id}
          className="flex flex-col items-center bg-white rounded-2xl shadow-md p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200"
        >
          {/* Avatar */}
          <div className="relative mb-3">
            <div className="rounded-full p-[3px] bg-gradient-to-tr from-purple-400 via-pink-400 to-yellow-400 transition-all duration-300 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500">
              {user && (
                <img
                  src={user.profile_picture}
                  alt={user.full_name || "User"}
                  className="rounded-full w-16 h-16 sm:w-20 sm:h-20 object-cover border-2 border-white shadow-md"
                  loading="lazy"
                  width={80}
                  height={80}
                />
              )}
            </div>
          </div>

          {/* Name & Username */}
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              {user.full_name}
            </p>
            {user.username && (
              <p className="text-slate-500 text-xs sm:text-sm mb-2">
                @{user.username}
              </p>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-xs sm:text-sm text-gray-600 text-center line-clamp-3 mb-4">
              {user.bio}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => navigate(`/messages/${user._id}`)}
              className="flex items-center justify-center gap-2 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white transition duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Message</span>
            </button>
            <button
              onClick={() => navigate(`/profile/${user._id}`)}
              className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-600 hover:text-white transition duration-200"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">View Profile</span>
            </button>
          </div>
        </div>
      )),
    [connections, navigate]
  );

  return (
    <div className="h-[100dvh] flex flex-col bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="shrink-0 px-4 py-6 sm:px-6 lg:px-8 text-center z-10 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
          Messages
        </h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg">
          Talk to your friends and family
        </p>
      </div>

      {connections.length > 0 ? (
        <div className="flex-1 bg-gradient-to-b from-slate-50 to-white overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid custom-cols-messages gap-5">
            {connectionCards}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 justify-center mt-30 h-full text-center px-4 bg-transparent">
          <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl">
            You haven’t added any connections yet. <br />
            Add connections to start chatting!
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
