import React from "react";
import { Link } from "react-router-dom";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import logo from "../assets/logo.svg";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector((state) => state.user?.value);
  const { signOut } = useClerk();

  const displayName = user?.full_name || "Guest";
  const displayUsername = user?.username ? `@${user.username}` : "";

  return (
    <div
      className={`bg-white border-r border-gray-200 h-full flex flex-col justify-between max-sm:absolute top-0 bottom-0 z-50 w-60 md:w-52 sm:w-48 max-[400px]:w-44 xl:w-72 min-w-[12rem] transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"
      }`}
    >
      <div className="w-full">
        <Link to="/" className="block px-6 py-3">
          <img
            src={logo}
            className="h-8 sm:h-9 md:h-10 w-auto cursor-pointer"
            alt="logo"
          />
        </Link>

        <hr className="border-gray-300 mb-8" />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white text-sm"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      {/* Bottom user area */}
      {/* Bottom user area */}
      <div className="flex items-center justify-between border-t border-gray-200 p-3 px-4">
        <div className="flex items-center gap-2 cursor-pointer transition-all duration-200 flex-shrink-0">
          {/* Avatar wrapper: smaller and centered */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
            <UserButton />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {displayName}
            </span>
            {displayUsername && (
              <span className="text-xs text-gray-500 truncate">
                {displayUsername}
              </span>
            )}
          </div>
        </div>

        {/* Logout button: vertically center with avatar */}
        <button
          onClick={() => signOut()}
          className="flex group items-center justify-center cursor-pointer rounded-full flex-shrink-0 mb-[3px] ml-[15px]"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-600 group-hover:text-red-500 transition-all duration-200" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
