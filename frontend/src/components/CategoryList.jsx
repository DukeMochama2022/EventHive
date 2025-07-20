import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const CategoryList = ({ categories, onEdit, onDelete, loading }) => {
  if (loading)
    return (
      <div className="text-center text-blue-700 font-bold">
        Loading categories...
      </div>
    );
  if (!categories.length)
    return (
      <div className="text-center text-gray-500 font-semibold">
        No categories found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h3 className="text-lg font-bold text-blue-700 mb-4">Categories</h3>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-xl shadow p-4 border border-blue-100 hover:shadow-md transition"
          >
            <div className="flex-1">
              <div className="font-semibold text-blue-800 text-base mb-1">
                {cat.name}
              </div>
              <div className="text-gray-500 text-sm">
                {cat.description || (
                  <span className="italic text-gray-300">No description</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => onEdit(cat)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold text-sm transition"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => onDelete(cat._id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm transition"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
 