const express = require("express");
const router = express.Router();
const {
  createBooking,
  getClientBookings,
  getPlannerBookings,
  getBookingById,
  updateBookingStatus,
} = require("../controllers/bookingController");
const protect = require("../middleware/auth");
const setRole = require("../middleware/roleCheck");

// Create a booking (client or admin)
router.post("/create", protect, setRole("client", "admin"), createBooking);

// Get all bookings for the logged-in client
router.get("/my", protect, setRole("client"), getClientBookings);

// Get all bookings for the logged-in planner (or all for admin)
router.get(
  "/for-planner",
  protect,
  setRole("planner", "admin"),
  getPlannerBookings
);

// Get booking details by ID (all roles)
router.get("/:id", protect, getBookingById);

// Update booking status (client, planner, or admin)
router.patch(
  "/:id",
  protect,
  setRole("client", "planner", "admin"),
  updateBookingStatus
);

module.exports = router;
