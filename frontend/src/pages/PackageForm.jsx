import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, Plus } from "lucide-react";
import {
  showSuccess,
  showError,
  showLoading,
  updateToast,
  successMessages,
  errorMessages,
} from "../utils/toast";
import LoadingSkeleton from "../components/LoadingSkeleton";

const PackageForm = () => {
  const { backendURL } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [backendURL]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await axios.get(`${backendURL}/api/category`);
      setCategories(response.data.categories || []);
    } catch (error) {
      showError("Failed to load categories. Please refresh the page.");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    const loadingToast = showLoading("Creating package...");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await axios.post(`${backendURL}/api/packages/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      updateToast(loadingToast, "success", successMessages.packageCreated);
      navigate("/dashboard/packages");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || errorMessages.createFailed;
      updateToast(loadingToast, "error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="max-w-xl mx-auto">
        <LoadingSkeleton type="form" lines={6} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Plus className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-700">Create New Package</h2>
      </div>

      <div>
        <label className="block text-blue-700 font-semibold mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
          placeholder="Enter package title"
        />
      </div>

      <div>
        <label className="block text-blue-700 font-semibold mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          rows={4}
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
          placeholder="Describe your package..."
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-blue-700 font-semibold mb-1">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            min="0"
            step="0.01"
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            placeholder="0.00"
          />
        </div>
        <div className="flex-1">
          <label className="block text-blue-700 font-semibold mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            placeholder="Enter location"
          />
        </div>
      </div>

      <div>
        <label className="block text-blue-700 font-semibold mb-1">
          Category
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          disabled={isSubmitting || categoriesLoading}
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-blue-700 font-semibold mb-1">Image</label>
        <div className="relative">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {form.image && (
            <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <Upload className="w-4 h-4" />
              {form.image.name}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating Package...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" />
            Create Package
          </>
        )}
      </button>
    </form>
  );
};

export default PackageForm;
