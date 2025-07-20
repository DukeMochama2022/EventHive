import React, { useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  CalendarCheck2,
  BarChart2,
} from "lucide-react";

const Sidebar = () => {
  const { userData } = useContext(AuthContext);
  const isAdmin = userData?.role === "admin";
  const isPlanner = userData?.role === "planner";
  const isClient = userData?.role === "client";

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-gradient-to-b from-blue-700 via-purple-700 to-blue-900 border-r shadow-lg p-0 hidden md:flex flex-col z-30">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-blue-800">
        <LayoutDashboard className="w-7 h-7 text-white" />
        <span className="font-bold text-xl text-white tracking-wide">
          Dashboard
        </span>
      </div>
      <nav className="flex flex-col gap-2 mt-6 px-2">
        {(isAdmin || isPlanner) && (
          <>
            <NavLink
              to="/dashboard/analytics"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <BarChart2 className="w-5 h-5" />
              Analytics
            </NavLink>
            <NavLink
              to="/dashboard/packages"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <FolderKanban className="w-5 h-5" />
              {isAdmin ? "All Packages" : "My Packages"}
            </NavLink>
            <NavLink
              to="/dashboard/packages/create"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <PlusCircle className="w-5 h-5" />
              Create Package
            </NavLink>
            <NavLink
              to="/dashboard/bookings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <CalendarCheck2 className="w-5 h-5" />
              Manage Bookings
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/dashboard/categories"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-white/20 text-white shadow"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <LayoutDashboard className="w-5 h-5" />
                Manage Categories
              </NavLink>
            )}
          </>
        )}
        {isClient && (
          <NavLink
            to="/dashboard/bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-white/20 text-white shadow"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <CalendarCheck2 className="w-5 h-5" />
            My Bookings
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 pt-10 md:pt-12 overflow-y-auto h-screen bg-gradient-to-b from-gray-50 to-blue-50">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
