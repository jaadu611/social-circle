import React, { useState, useMemo } from "react";
import { Calendar, MapPin, UserPlus, UserX, PenBox } from "lucide-react";
import moment from "moment";
import { useAuth } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchConnections } from "../features/connectionSlice";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AnimatedMessageCircle from "./AnimatedMessageCircle";

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

  const handleFollowToggle = async () => {
    const action = isFollowing ? "/api/user/unfollow" : "/api/user/follow";
    const optimisticState = !isFollowing;

    setIsFollowing(optimisticState);
    try {
      const token = await getToken();
      const { data } = await api.post(
        action,
        { id: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) {
        setIsFollowing(!optimisticState);
        toast.error(data.message);
      } else {
        dispatch(fetchConnections(token));
      }
    } catch (error) {
      setIsFollowing(!optimisticState);
      toast.error(error.message);
    }
  };

  const handleConnectionRequest = async () => {
    if (isConnected) {
      return navigate(`/messages/${user._id}`);
    }
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/connection",
        { id: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast[data.success ? "success" : "error"](data.message);
      if (data.success) dispatch(fetchConnections(token));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="rounded-xl shadow-lg">
      <div className="relative mx-auto p-6 sm:p-8 md:p-10">
        {/* Edit Button */}
        {isOwnProfile && (
          <button
            onClick={() => setShowEdit(true)}
            className="absolute top-4 right-4 flex items-center gap-1 cursor-pointer px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm z-10"
          >
            <PenBox className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}

        {/* Profile Info */}
        <div className="flex flex-col bp-411:flex-row items-center bp-411:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white -mt-24 relative z-10">
            {/* Profile image */}
            {user?.profile_picture && (
              <img
                src={user.profile_picture}
                alt={user.full_name || "User"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>

          {/* Info & Actions */}
          <div className="flex-1 w-full flex flex-col bp-411:flex-row bp-411:justify-between gap-4 bp-411:gap-6 mt-4 bp-411:mt-0 z-0">
            {/* User Details */}
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

              {/* Stats */}
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

              {/* Location & Joined */}
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

            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="flex flex-col md:flex-row bp-411:items-end gap-3 mt-4 bp-411:mt-0">
                <button
                  onClick={handleFollowToggle}
                  aria-label={isFollowing ? "Unfollow" : "Follow"}
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
                      <AnimatedMessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
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
