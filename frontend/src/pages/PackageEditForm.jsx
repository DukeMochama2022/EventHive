import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const PackageEditForm = () => {
  const { backendURL } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch categories
    axios
      .get(`${backendURL}/api/category`)
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => toast.error("Failed to load categories"));
    // Fetch package data
    axios
      .get(`${backendURL}/api/packages/${id}`)
      .then((res) => {
        const pkg = res.data.data;
        setForm({
          title: pkg.title,
          description: pkg.description,
          price: pkg.price,
          category: pkg.category?._id || pkg.category,
          location: pkg.location,
          image: null, // File input is always empty; show preview below
          imagePreview: pkg.image,
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load package");
        setLoading(false);
      });
  }, [backendURL, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "imagePreview" && value) formData.append(key, value);
    });
    try {
      await axios.put(`${backendURL}/api/packages/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Package updated successfully!");
      navigate("/dashboard/packages");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update package");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center text-blue-700 font-bold">
        Loading package...
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow space-y-6"
    >
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Edit Package</h2>
      <div>
        <label className="block text-blue-700 font-semibold mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        {form.imagePreview && (
          <img
            src={form.imagePreview}
            alt="Current"
            className="mt-2 w-full h-32 object-cover rounded-lg border"
          />
        )}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition"
      >
        {submitting ? "Updating..." : "Update Package"}
      </button>
    </form>
  );
};

export default PackageEditForm;
 