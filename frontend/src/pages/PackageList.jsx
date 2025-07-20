import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  MapPin,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Plus,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";
import {
  showSuccess,
  showError,
  showLoading,
  updateToast,
  successMessages,
  errorMessages,
} from "../utils/toast";
import LoadingSkeleton from "../components/LoadingSkeleton";

const PackageList = () => {
  const { backendURL, userData } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, [backendURL, userData]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${backendURL}/api/packages`);
      let pkgs = response.data.data || [];

      // If planner, show only their packages
      if (userData?.role === "planner") {
        pkgs = pkgs.filter(
          (pkg) =>
            pkg.planner?._id === userData.id ||
            pkg.planner === userData.id ||
            pkg.planner?.username === userData.username
        );
      }
      setPackages(pkgs);
    } catch (err) {
      setError("Failed to load packages. Please refresh the page.");
      showError("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this package? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(id);
    const loadingToast = showLoading("Deleting package...");

    try {
      await axios.delete(`${backendURL}/api/packages/delete/${id}`, {
        withCredentials: true,
      });

      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      updateToast(loadingToast, "success", successMessages.packageDeleted);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || errorMessages.deleteFailed;
      updateToast(loadingToast, "error", errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-700">
            {userData?.role === "admin" ? "All Packages" : "My Packages"}
          </h2>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} type="card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-700">
            {userData?.role === "admin" ? "All Packages" : "My Packages"}
          </h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Packages
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPackages}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-700">
            {userData?.role === "admin" ? "All Packages" : "My Packages"}
          </h2>
        </div>
        <button
          onClick={() => navigate("/dashboard/packages/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Package
        </button>
      </div>

      {!packages.length ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Packages Found
          </h3>
          <p className="text-gray-500 mb-4">
            {userData?.role === "admin"
              ? "There are no packages in the system yet."
              : "You haven't created any packages yet."}
          </p>
          <button
            onClick={() => navigate("/dashboard/packages/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create Your First Package
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white rounded-2xl shadow-lg p-5 flex flex-col h-full border border-blue-100 hover:shadow-xl transition group"
            >
              <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {pkg.image ? (
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="object-cover w-full h-full rounded-xl group-hover:scale-105 transition"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-blue-300" />
                )}
              </div>
              <h3 className="text-lg font-bold text-blue-800 mb-1 truncate">
                {pkg.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Tag className="w-4 h-4 text-purple-500" />
                <span>{pkg.category?.name || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{pkg.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-green-700">
                  Ksh {pkg.price}
                </span>
              </div>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/dashboard/packages/edit/${pkg._id}`)
                  }
                  disabled={deletingId === pkg._id}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  disabled={deletingId === pkg._id}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === pkg._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackageList;
