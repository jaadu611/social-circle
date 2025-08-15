import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserRoundPen,
  MessageSquare,
  UserXIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../features/connectionSlice";
import api from "../api/axios";
import toast from "react-hot-toast";

const Connections = () => {
  const [currentTab, setCurrentTab] = useState("Followers");
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const { connections, pendingConnections, followers, following } = useSelector(
    (state) => state.connections
  );

  const dataArray = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Pending", value: pendingConnections, icon: UserRoundPen },
    { label: "Connections", value: connections, icon: UserPlus },
  ];

  const acceptConnection = async (userId) => {
    try {
      const { data } = await api.post(
        "/api/user/accept",
        { id: userId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(await getToken()));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchConnections(token));
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="mb-10 text-center px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-1 sm:mb-2">
            Connections
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-md mx-auto">
            Manage your network and discover new connections
          </p>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center justify-center h-16 sm:h-20 px-2 py-1 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition duration-300 cursor-pointer hover:border-purple-600 hover:bg-gray-50"
            >
              <b className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                {item.value.length}
              </b>
              <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-10">
          {dataArray.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setCurrentTab(tab.label)}
              className={`flex justify-center items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-medium shadow-sm transition-all focus:outline-none hover:-translate-y-[1px] hover:shadow-md cursor-pointer duration-300 ${
                currentTab === tab.label
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid custom-cols-connections grid-cols-1 gap-4 justify-center">
          {dataArray
            .find((item) => item.label === currentTab)
            .value.map((user) => (
              <div
                key={user._id}
                className="w-full flex gap-4 group items-start bg-white rounded-xl p-4 sm:p-5 shadow hover:shadow-md transition-all"
              >
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md group-hover:ring-2 group-hover:ring-indigo-600 transition-all duration-200"
                />
                <div className="flex-1">
                  <p className="relative w-fit text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-all duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-purple-500 group-hover:after:w-full after:transition-all after:duration-300">
                    {user.full_name}
                  </p>
                  {user.username && (
                    <p className="text-xs sm:text-sm text-slate-500">
                      @{user.username}
                    </p>
                  )}
                  <p className="hidden sm:block text-xs sm:text-sm text-slate-500 mt-1">
                    {user.bio.slice(0, 50)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                    <button
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="flex-1 px-3 py-1.5 cursor-pointer sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-500 hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-300 focus:outline-none text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                      View Profile
                    </button>

                    {currentTab === "Following" && (
                      <button
                        onClick={() => handleUnfollow(user._id)}
                        className="flex-1 px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-medium sm:font-semibold rounded-md sm:rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 shadow transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-0.5 sm:gap-1"
                      >
                        <UserXIcon className="h-3 w-3 sm:h-4 sm:w-4" /> Unfollow
                      </button>
                    )}

                    {currentTab === "Pending" && (
                      <button
                        onClick={() => acceptConnection(user._id)}
                        className="flex-1 px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-medium sm:font-semibold rounded-md sm:rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 shadow transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-0.5 sm:gap-1"
                      >
                        <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" /> Accept
                      </button>
                    )}

                    {currentTab === "Connections" && (
                      <button
                        onClick={() => navigate(`/messages/${user._id}`)}
                        className="flex-1 px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-medium sm:font-semibold rounded-md sm:rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 shadow transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-0.5 sm:gap-1"
                      >
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
