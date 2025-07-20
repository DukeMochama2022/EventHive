const express = require("express");
const router = express.Router();
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require("../controllers/categoryController");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/roleCheck");

router.get("/", getCategories); // for public
router.post("/create", protect, allowRoles("admin"), createCategory);
router.put("/update/:id", protect, allowRoles("admin"), updateCategory);
router.delete("/delete/:id", protect, allowRoles("admin"), deleteCategory);

module.exports = router;
