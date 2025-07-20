import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Shield, Lock, ArrowLeft, Home, LogIn } from "lucide-react";

const Unauthorized = () => {
  const [searchParams] = useSearchParams();
  const requiredRole = searchParams.get("required");
  const currentRole = searchParams.get("current");

  const getMessage = () => {
    if (requiredRole && currentRole) {
      return `You need ${requiredRole} permissions to access this page. Your current role is ${currentRole}.`;
    }
    if (requiredRole) {
      return `You need ${requiredRole} permissions to access this page.`;
    }
    return "You don't have permission to access this page.";
  };

  const getTitle = () => {
    if (requiredRole && currentRole) {
      return "Insufficient Permissions";
    }
    return "Access Denied";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{getTitle()}</h1>

        <p className="text-gray-600 mb-8 text-lg">{getMessage()}</p>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!currentRole ? (
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Link>
          )}

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Information */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700">
              If you believe you should have access to this page, please contact
              your administrator.
            </p>
          </div>

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

export default Unauthorized;
