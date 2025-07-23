const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  getAllContactMessages,
} = require("../controllers/contactMessageController");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/roleCheck");

// Public: Submit contact message
router.post(
  "/",
  protect,
  allowRoles("client", "planner"),
  createContactMessage
);

// Admin: Get all contact messages
router.get("/", protect, allowRoles("admin"), getAllContactMessages);

module.exports = router;
