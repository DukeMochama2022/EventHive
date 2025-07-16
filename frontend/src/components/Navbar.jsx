import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Sparkles, User } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const { backendURL, userData, setUserData, isLoggedIn, setIsLoggedIn } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

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
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-purple-600 font-medium transition"
          >
            Dashboard
          </Link>
        </div>
        {/* User Info */}
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
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
