import React from "react";
import { dummyUserData } from "../assets/assets";
import {
  MapPin,
  MessageCircle,
  PlusCircle,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  const currentUser = dummyUserData;

  const handleFollow = async () => {};
  const handleConnectionRequest = async () => {};

  return (
    <div className="group relative bg-white border-2 border-transparent rounded-lg shadow-sm p-4 transition-all duration-200 ease-in-out hover:scale-105 hover:border-indigo-500">
      <Link to={`/profile/${user._id}`}>
        <div className="flex flex-col items-center text-center">
          {/* Profile Picture with hover ring */}
          <div className="rounded-full transition-all duration-200 group-hover:ring-2 group-hover:ring-indigo-500">
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="w-16 h-16 rounded-full shadow object-cover"
            />
          </div>

          {/* Name with pseudo underline */}
          <h2 className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800 relative mt-3 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-300 group-hover:after:w-full">
            {user.full_name}
          </h2>

          {user.username && (
            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-1">
              @{user.username}
            </p>
          )}

          {user.bio && (
            <p className="hidden lg:block text-[9px] sm:text-[10px] md:text-xs text-gray-600 mt-2 line-clamp-2 px-2">
              {user.bio}
            </p>
          )}
        </div>
      </Link>

      <div className="flex-col hidden lg:flex justify-center items-center gap-2 mt-4 text-gray-600 text-[9px] sm:text-xs md:text-sm">
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-[9px] sm:text-xs md:text-sm transition-colors group-hover:bg-slate-100 group-hover:border-slate-400 group-hover:text-slate-800 max-w-[150px] sm:max-w-[180px] md:max-w-[200px] break-words truncate">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{user.location}</span>
        </div>

        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-[9px] sm:text-xs md:text-sm transition-colors group-hover:bg-slate-100 group-hover:border-slate-400 group-hover:text-slate-800">
          <span>{user.followers.length}</span> Followers
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {/* Follow / Following Button */}
        <button
          onClick={handleFollow}
          className="flex-1 min-w-[120px] px-3 py-2 rounded-md flex justify-center items-center gap-1 text-white text-[10px] xs:text-xs sm:text-sm font-medium transition bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95"
        >
          {currentUser?.following.includes(user._id) ? (
            <>
              <UserCheck
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="whitespace-nowrap">Following</span>
            </>
          ) : (
            <>
              <UserPlus
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="whitespace-nowrap">Follow</span>
            </>
          )}
        </button>

        {/* Connect / Message Button */}
        <button
          onClick={handleConnectionRequest}
          className="flex-1 min-w-[120px] px-3 py-2 h-10 rounded-md flex items-center justify-center gap-1 sm:gap-2 border border-slate-300 text-slate-600 
    hover:border-indigo-500 hover:text-indigo-600 
    active:translate-y-[1px] transition group"
          title={
            currentUser.connections.includes(user._id)
              ? "Send Message"
              : "Send Connection Request"
          }
          aria-label={
            currentUser.connections.includes(user._id) ? "Message" : "Connect"
          }
        >
          {currentUser.connections.includes(user._id) ? (
            <>
              <MessageCircle
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-[10px] xs:text-xs sm:text-sm whitespace-nowrap leading-none">
                Message
              </span>
            </>
          ) : (
            <>
              <PlusCircle
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-[10px] xs:text-xs sm:text-sm whitespace-nowrap leading-none">
                Add Connection
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
