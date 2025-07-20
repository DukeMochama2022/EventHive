const Category = require("../models/Category");

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    }
    const exists = await Category.findOne({ name });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists." });
    }
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
    if (name) category.name = name;
    if (description) category.description = description;
    await category.save();
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
    res.json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching categories." });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
