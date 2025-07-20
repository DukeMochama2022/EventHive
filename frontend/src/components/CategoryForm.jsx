import React, { useState } from "react";

const CategoryForm = ({ initial = {}, onSubmit, loading, mode = "create" }) => {
  const [form, setForm] = useState({
    name: initial.name || "",
    description: initial.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 space-y-4 max-w-md mx-auto"
    >
      <h3 className="text-xl font-bold mb-2 text-blue-700">
        {mode === "edit" ? "Edit Category" : "Add New Category"}
      </h3>
      <div>
        <label className="block text-blue-700 font-semibold mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
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
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition"
      >
        {loading
          ? mode === "edit"
            ? "Updating..."
            : "Adding..."
          : mode === "edit"
          ? "Update Category"
          : "Add Category"}
      </button>
    </form>
  );
};

export default CategoryForm;
 