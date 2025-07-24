import React, { useContext, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Sparkles, User, Menu, X } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const { backendURL, userData, setUserData, isLoggedIn, setIsLoggedIn } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide navbar on login page
  if (location.pathname === "/login") return null;

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + "/api/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="w-full bg-white shadow sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-blue-600" />
          <span className="font-bold text-lg text-blue-700">EventHive</span>
        </Link>
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-700 hover:text-blue-600 font-medium transition px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-blue-100 text-blue-800 font-bold" : ""
              }`
            }
            role="menuitem"
          >
            Home
          </NavLink>
          <NavLink
            to="/packages"
            className={({ isActive }) =>
              `nav-link px-3 py-2 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100 transition ${
                isActive ? "bg-blue-100 text-blue-800 font-bold" : ""
              }`
            }
            role="menuitem"
          >
            Packages
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `nav-link px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-100 transition ${
                isActive ? "bg-purple-100 text-purple-800 font-bold" : ""
              }
            `
            }
            role="menuitem"
          >
            Pricing
          </NavLink>
          {isLoggedIn && userData && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-gray-700 hover:text-purple-600 font-medium transition px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-purple-100 text-purple-800 font-bold" : ""
                }`
              }
              role="menuitem"
            >
              Dashboard
            </NavLink>
          )}
        </div>
        {/* Desktop User Info/Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && userData ? (
            <>
              <div className="flex items-center gap-3 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-800">
                  {userData.username}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold uppercase">
                  {userData.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="ml-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-indigo-600 cursor-pointer hover:to-purple-700 transition shadow"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full transition ${
                  isActive ? "ring-2 ring-blue-400" : ""
                }`
              }
              role="menuitem"
            >
              Login
            </NavLink>
          )}
        </div>
        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="w-7 h-7 text-blue-700" />
          ) : (
            <Menu className="w-7 h-7 text-blue-700" />
          )}
        </button>
      </div>
      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white shadow-lg border-t border-gray-100 px-4 py-4 space-y-4"
            role="menu"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block text-gray-700 hover:text-blue-600 font-medium transition px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-blue-100 text-blue-800 font-bold" : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              Home
            </NavLink>
            <NavLink
              to="/packages"
              className={({ isActive }) =>
                `block text-gray-700 hover:text-blue-600 font-medium transition px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-blue-100 text-blue-800 font-bold" : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              Packages
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `block text-gray-700 hover:text-purple-600 font-medium transition px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-purple-100 text-purple-800 font-bold" : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              Pricing
            </NavLink>
            {isLoggedIn && userData && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block text-gray-700 hover:text-purple-600 font-medium transition px-3 py-2 rounded-md text-sm ${
                    isActive ? "bg-purple-100 text-purple-800 font-bold" : ""
                  }`
                }
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                Dashboard
              </NavLink>
            )}
            {isLoggedIn && userData ? (
              <>
                <div className="flex items-center gap-3 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mt-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">
                    {userData.username}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold uppercase">
                    {userData.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition shadow"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `block mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full text-center transition ${
                    isActive ? "ring-2 ring-blue-400" : ""
                  }`
                }
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                Login
              </NavLink>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
