import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import { Menu, X } from "lucide-react";
import Loading from "../components/Loading";

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return user ? (
    <div className="w-full h-screen flex relative">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 bg-slate-50 overflow-y-auto">
        <Outlet />
      </div>

      {sidebarOpen ? (
        <X
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-2 z-50 w-9 h-9 p-2 rounded-md bg-white shadow text-gray-600 transition-all duration-200 hover:bg-gray-100 active:scale-95 sm:hidden"
        />
      ) : (
        <Menu
          onClick={() => setSidebarOpen(true)}
          className="absolute top-3 right-2 z-50 w-9 h-9 p-2 rounded-md bg-white shadow text-gray-600 transition-all duration-200 hover:bg-gray-100 active:scale-95 sm:hidden"
        />
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
