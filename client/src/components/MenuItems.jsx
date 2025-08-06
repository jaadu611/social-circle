import React from "react";
import { menuItemsData } from "../assets/assets";
import { NavLink } from "react-router-dom";

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className="px-6 text-gray-600 space-y-1 font-medium text-sm sm:text-[15px]">
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `px-3.5 py-2 flex items-center gap-3 rounded-xl transition-all duration-200 ${
              isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
            }`
          }
        >
          <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          <span className="truncate max-w-[140px] sm:max-w-none">{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MenuItems;
