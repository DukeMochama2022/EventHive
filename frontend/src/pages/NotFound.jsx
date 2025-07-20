import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>

        {/* Main Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist. It might have been
          moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Home
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Login
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
