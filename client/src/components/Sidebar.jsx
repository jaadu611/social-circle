import React from "react";
import { assets, dummyUserData } from "../assets/assets";
import { Link } from "react-router-dom";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { useClerk, UserButton } from "@clerk/clerk-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = dummyUserData;
  const { signOut } = useClerk();

  return (
    <div
      className={`bg-white border-r h-full border-gray-200 flex flex-col items-center justify-between max-sm:absolute top-0 bottom-0 z-100 w-60 md:w-52 sm:w-48 max-[400px]:w-44 xl:w-72 ${
        sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="w-full">
        <Link to="/" className="block px-6 py-3">
          <img
            src={assets.logo}
            className="h-8 sm:h-9 md:h-10 w-auto cursor-pointer"
            alt="logo"
          />
        </Link>
        <hr className="border-gray-300 mb-8" />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer text-sm"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      <div className="w-full border-t border-gray-200 p-4 px-6 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <UserButton />
          <div className="flex flex-col">
            <h1 className="text-sm font-medium truncate max-w-[6rem] md:max-w-[5rem]">
              {user.full_name}
            </h1>
            {user.username && (
              <p className="text-sm text-gray-500 truncate max-w-[6rem] md:max-w-[5rem]">
                @{user.username}
              </p>
            )}
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-red-600 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
