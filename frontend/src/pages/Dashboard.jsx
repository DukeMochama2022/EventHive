import React, { useContext, useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  CalendarCheck2,
  BarChart2,
  Menu,
  X,
} from "lucide-react";
import useUnreadCount from "../hooks/useUnreadCount";
import axios from "axios";

const Sidebar = ({ mobile = false, open = false, onClose = () => {} }) => {
  const { backendURL, userData } = useContext(AuthContext);
  const isAdmin = userData?.role === "admin";
  const isPlanner = userData?.role === "planner";
  const isClient = userData?.role === "client";
  const { unreadCount } = useUnreadCount();

  // Sidebar content
  const content = (
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
            onClick={mobile ? onClose : undefined}
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
            onClick={mobile ? onClose : undefined}
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
            onClick={mobile ? onClose : undefined}
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
            onClick={mobile ? onClose : undefined}
          >
            <CalendarCheck2 className="w-5 h-5" />
            Manage Bookings
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </NavLink>
          {isAdmin && (
            <>
              <NavLink
                to="/dashboard/categories"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-white/20 text-white shadow"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`
                }
                onClick={mobile ? onClose : undefined}
              >
                <LayoutDashboard className="w-5 h-5" />
                Manage Categories
              </NavLink>
              <NavLink
                to="/dashboard/messages"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-white/20 text-white shadow"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`
                }
                onClick={mobile ? onClose : undefined}
              >
                <LayoutDashboard className="w-5 h-5" />
                Messages
              </NavLink>
            </>
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
          onClick={mobile ? onClose : undefined}
        >
          <CalendarCheck2 className="w-5 h-5" />
          My Bookings
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </NavLink>
      )}
    </nav>
  );

  if (mobile) {
    return (
      <div
        className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />
        {/* Drawer */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-700 via-purple-700 to-blue-900 border-r shadow-lg z-50 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-2 px-6 py-6 border-b border-blue-800 justify-between">
            <span className="font-bold text-xl text-white tracking-wide flex items-center gap-2">
              <LayoutDashboard className="w-7 h-7 text-white" /> Dashboard
            </span>
            <button onClick={onClose} className="text-white focus:outline-none">
              <X className="w-7 h-7" />
            </button>
          </div>
          {content}
        </aside>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-gradient-to-b from-blue-700 via-purple-700 to-blue-900 border-r shadow-lg p-0 hidden md:flex flex-col z-30">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-blue-800">
        <LayoutDashboard className="w-7 h-7 text-white" />
        <span className="font-bold text-xl text-white tracking-wide">
          Dashboard
        </span>
      </div>
      {content}
    </aside>
  );
};

const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full shadow p-2 border border-blue-100 focus:outline-none"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open sidebar menu"
      >
        <Menu className="w-7 h-7 text-blue-700" />
      </button>
      {/* Mobile Drawer */}
      <Sidebar mobile open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {/* Desktop Sidebar */}
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 pt-10 md:pt-12 overflow-y-auto h-screen bg-gradient-to-b from-gray-50 to-blue-50">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
