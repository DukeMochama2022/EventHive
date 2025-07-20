const express = require("express");
const router = express.Router();

const upload = require("../utils/multer");

const {
  createEventPackage,
  getAllEventPackages,
  getEventPackageById,
  updateEventPackage,
  deleteEventPackage,
} = require("../controllers/eventPackageController");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/roleCheck");

// Create a new event package (planner only)
router.post(
  "/create",
  protect,
  allowRoles("admin", "planner"),
  upload.single("image"),
  createEventPackage
);

// Get all event packages (public)
router.get("/", getAllEventPackages);

// Get a single event package by ID (public)
router.get("/:id", getEventPackageById);

// Update an event package (planner or admin)
router.put(
  "/update/:id",
  protect,
  allowRoles("admin", "planner"),
  upload.single("image"),
  updateEventPackage
);

// Delete an event package (planner or admin)
router.delete(
  "/delete/:id",
  protect,
  allowRoles("admin", "planner"),
  deleteEventPackage
);

module.exports = router;
