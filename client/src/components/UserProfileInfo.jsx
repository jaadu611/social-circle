import React, { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  MessageCircle,
  PenBox,
  UserPlus,
  UserX,
} from "lucide-react";
import moment from "moment";
import { useAuth } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchConnections } from "../features/connectionSlice";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.value);

  const isOwnProfile = useMemo(
    () => !profileId || currentUser._id === profileId,
    [profileId, currentUser._id]
  );

  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following?.includes(user._id) || false
  );

  const isConnected = useMemo(
    () => currentUser.connections?.includes(user._id),
    [currentUser.connections, user._id]
  );

  const handleFollow = async () => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/follow",
        { id: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setIsFollowing(true);
        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/unfollow",
        { id: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setIsFollowing(false);
        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConnectionRequest = async () => {
    if (isConnected) {
      navigate(`/messages/${user._id}`);
      return;
    }
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/connection",
        { id: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="rounded-xl shadow-lg">
      <div className="relative max-w-5xl mx-auto p-6 sm:p-8 md:p-10">
        {isOwnProfile && (
          <button
            onClick={() => setShowEdit(true)}
            className="absolute top-4 right-4 flex items-center gap-1 cursor-pointer px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm z-10"
          >
            <PenBox className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}

        <div className="flex flex-col bp-411:flex-row items-center bp-411:items-start gap-6">
          <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-white -mt-24 md:-mt-26 relative z-10">
            {user?.profile_picture && (
              <img
                src={user.profile_picture}
                alt={user.full_name || "User"}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex-1 w-full flex flex-col bp-411:flex-row bp-411:justify-between gap-4 bp-411:gap-6 mt-4 bp-411:mt-0 z-0">
            <div className="flex-1 min-w-0 text-center bp-411:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {user.full_name}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base truncate">
                {user.username ? `@${user.username}` : "No Username Yet"}
              </p>

              {user.bio && (
                <p className="mt-2 text-gray-700 text-sm sm:text-base">
                  {user.bio}
                </p>
              )}

              <div className="flex mt-4 text-gray-700 justify-center bp-411:justify-start">
                <div className="min-w-[80px] text-center">
                  <span className="font-bold text-lg sm:text-xl">
                    {posts.length}
                  </span>
                  <div className="text-sm sm:text-base text-gray-500">
                    Posts
                  </div>
                </div>
                <div className="min-w-[80px] text-center">
                  <span className="font-bold text-lg sm:text-xl">
                    {user.followers.length}
                  </span>
                  <div className="text-sm sm:text-base text-gray-500">
                    Followers
                  </div>
                </div>
                <div className="min-w-[80px] text-center">
                  <span className="font-bold text-lg sm:text-xl">
                    {user.following.length}
                  </span>
                  <div className="text-sm sm:text-base text-gray-500">
                    Following
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-gray-500 text-sm justify-center bp-411:justify-start">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location || "No Location Added Yet"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {moment(user.createdAt).fromNow()}
                </span>
              </div>
            </div>

            {!isOwnProfile && (
              <div className="flex flex-col items-center md:flex-row bp-411:items-end gap-3 mt-4 bp-411:mt-0">
                <button
                  onClick={!isFollowing ? handleFollow : handleUnfollow}
                  className={`flex items-center cursor-pointer justify-center gap-2 w-full bp-411:w-44 px-4 py-2 rounded-md font-medium text-white transition text-xs sm:text-sm ${
                    isFollowing
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserX className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="leading-none">Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="leading-none">Follow</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleConnectionRequest}
                  className={`flex items-center cursor-pointer justify-center gap-2 w-full bp-411:w-44 px-4 py-2 rounded-md font-medium border transition text-xs sm:text-sm ${
                    isConnected
                      ? "border-green-400 text-green-600 hover:border-green-500 hover:text-green-700"
                      : "border-slate-300 text-slate-600 hover:border-indigo-500 hover:text-indigo-600"
                  }`}
                >
                  {isConnected ? (
                    <>
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="leading-none">Message</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="leading-none">Add Connection</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
