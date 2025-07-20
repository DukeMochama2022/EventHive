import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";
import EditCategoryModal from "../components/EditCategoryModal";
import {
  showSuccess,
  showError,
  showLoading,
  updateToast,
  successMessages,
  errorMessages,
} from "../utils/toast";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { Shield, AlertCircle } from "lucide-react";

const CategoryManager = () => {
  const { backendURL, userData } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [backendURL]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${backendURL}/api/category`);
      setCategories(response.data.categories || []);
    } catch (error) {
      setError("Failed to load categories. Please refresh the page.");
      showError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (form) => {
    setFormLoading(true);
    const loadingToast = showLoading("Creating category...");

    try {
      await axios.post(`${backendURL}/api/category/create`, form, {
        withCredentials: true,
      });
      updateToast(loadingToast, "success", successMessages.categoryCreated);
      fetchCategories();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || errorMessages.createFailed;
      updateToast(loadingToast, "error", errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
  };

  const handleUpdate = async (form) => {
    setFormLoading(true);
    const loadingToast = showLoading("Updating category...");

    try {
      await axios.put(
        `${backendURL}/api/category/update/${editing._id}`,
        form,
        { withCredentials: true }
      );
      updateToast(loadingToast, "success", successMessages.categoryUpdated);
      setEditing(null);
      fetchCategories();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || errorMessages.updateFailed;
      updateToast(loadingToast, "error", errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    const loadingToast = showLoading("Deleting category...");

    try {
      await axios.delete(`${backendURL}/api/category/delete/${id}`, {
        withCredentials: true,
      });
      updateToast(loadingToast, "success", successMessages.categoryDeleted);
      fetchCategories();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || errorMessages.deleteFailed;
      updateToast(loadingToast, "error", errorMessage);
    }
  };

  if (userData?.role !== "admin") {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Access Denied
          </h3>
          <p className="text-red-600 mb-4">
            This page is only accessible to administrators.
          </p>
          <p className="text-sm text-red-500">
            Your current role: {userData?.role || "None"}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="mb-8">
          <LoadingSkeleton type="form" lines={2} />
        </div>
        <LoadingSkeleton type="list" lines={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Categories
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCategories}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        {/* Disable add form while editing */}
        {!editing && (
          <CategoryForm
            onSubmit={handleCreate}
            loading={formLoading}
            mode="create"
          />
        )}
      </div>
      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <EditCategoryModal
        open={!!editing}
        initial={editing || {}}
        onSubmit={handleUpdate}
        loading={formLoading}
        onClose={() => setEditing(null)}
      />
    </div>
  );
};

export default CategoryManager;
