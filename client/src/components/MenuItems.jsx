import React from "react";
import { NavLink } from "react-router-dom";
import { Users, Search, User, Home, MessageCircle } from "lucide-react";

const menuItemsData = [
  { to: "/", label: "Feed", Icon: Home },
  { to: "/messages", label: "Messages", Icon: MessageCircle },
  { to: "/connections", label: "Connections", Icon: Users },
  { to: "/discover", label: "Discover", Icon: Search },
  { to: "/profile", label: "Profile", Icon: User },
];

const MenuItems = ({ setSidebarOpen }) => (
  <div className="px-6 text-gray-600 space-y-1 font-medium text-sm sm:text-[15px]">
    {menuItemsData.map(({ to, label, Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        onClick={() => setSidebarOpen(false)}
        className={({ isActive }) =>
          `px-3.5 py-2 flex items-center gap-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
          }`
        }
        aria-current={({ isActive }) => (isActive ? "page" : undefined)}
        title={label}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        <span className="truncate max-w-[140px] sm:max-w-none">{label}</span>
      </NavLink>
    ))}
  </div>
);

export default MenuItems;
