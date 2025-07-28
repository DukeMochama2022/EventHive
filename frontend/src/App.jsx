import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminContactMessages from "./components/AdminContactMessages";
import Footer from "./pages/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/Dashboard";
import PackageForm from "./pages/PackageForm";
import PackageList from "./pages/PackageList";
import PackageEditForm from "./pages/PackageEditForm";
import CategoryManager from "./pages/CategoryManager";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import PublicPackages from "./pages/PublicPackages";
import BookingsList from "./pages/BookingsList";
import PlannerBookingsList from "./pages/PlannerBookingsList";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import PackageDetails from "./pages/PackageDetails";
import Analytics from "./pages/Analytics";
import { SocketProvider } from "./context/SocketContext";
import NotificationListener from "./components/NotificationListener";
import PricingPlans from "./pages/PricingPlans";
import Contact from "./pages/Contact";
import { lazy } from "react";
import AdminUserManager from "./components/AdminUserManager";
import TestEmail from "./pages/TestEmail";

function AppContent() {
  const location = useLocation();
  const { userData } = useContext(AuthContext);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div
        className={`flex-1 ${
          location.pathname !== "/login" &&
          !location.pathname.startsWith("/dashboard")
            ? "pb-70"
            : ""
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<PublicPackages />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test-email" element={<TestEmail />} />
          {/* Dashboard routes with nested children */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Default dashboard redirect based on role */}
            <Route
              index
              element={
                userData?.role === "client" ? (
                  <Navigate to="bookings" replace />
                ) : (
                  <Navigate to="packages" replace />
                )
              }
            />
            {/* Client route */}
            {userData?.role === "client" && (
              <Route path="bookings" element={<BookingsList />} />
            )}
            {/* Planner/Admin routes */}
            {(userData?.role === "planner" || userData?.role === "admin") && (
              <>
                <Route path="packages" element={<PackageList />} />
                <Route path="packages/create" element={<PackageForm />} />
                <Route path="packages/edit/:id" element={<PackageEditForm />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="bookings" element={<PlannerBookingsList />} />
                <Route path="analytics" element={<Analytics />} />
                <Route
                  path="messages"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminContactMessages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminUserManager />
                    </ProtectedRoute>
                  }
                />
              </>
            )}
          </Route>
          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {/* Hide Footer on /login and any /dashboard route */}
      {location.pathname !== "/login" &&
        !location.pathname.startsWith("/dashboard") && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: "8px",
          fontSize: "14px",
        }}
      />
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <SocketProvider>
        <NotificationListener />
        <AppContent />
      </SocketProvider>
    </Router>
  );
};

export default App;
