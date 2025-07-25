import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isLoggedIn, userData } = useContext(AuthContext);

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect to unauthorized
  if (requiredRole && userData?.role !== requiredRole) {
    return (
      <Navigate
        to={`/unauthorized?required=${requiredRole}&current=${
          userData?.role || "none"
        }`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
