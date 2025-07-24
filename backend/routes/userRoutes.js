const express = require("express");

const router = express.Router();
const protect = require("../middleware/auth");
const {
  getUserData,
  getAllUsers,
  deleteUser,
  updateUserPlan,
} = require("../controllers/userController");
const allowRoles = require("../middleware/roleCheck");

router.get("/data", protect, getUserData);
// Admin: Get all users
router.get("/", protect, allowRoles("admin"), getAllUsers);
// Admin: Delete user
router.delete("/:id", protect, allowRoles("admin"), deleteUser);
// Update user's plan
router.patch("/plan", protect, updateUserPlan);

module.exports = router;
