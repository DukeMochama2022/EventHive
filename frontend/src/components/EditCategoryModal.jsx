import React from "react";
import CategoryForm from "./CategoryForm";

const EditCategoryModal = ({ open, initial, onSubmit, loading, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-700 hover:text-purple-700 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-purple-700">
          Editing: {initial.name}
        </h3>
        <CategoryForm
          initial={initial}
          onSubmit={onSubmit}
          loading={loading}
          mode="edit"
        />
      </div>
    </div>
  );
};

export default EditCategoryModal;
 