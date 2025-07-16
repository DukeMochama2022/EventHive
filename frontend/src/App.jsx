import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Footer from "./pages/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div
        className={`flex-1 ${location.pathname !== "/login" ? "pb-70" : ""}`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {location.pathname !== "/login" && <Footer />}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
