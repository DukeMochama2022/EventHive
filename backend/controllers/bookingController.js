const Booking = require("../models/Booking");
const EventPackage = require("../models/EventPackage");
const User = require("../models/User");
const Plan = require("../models/Plan");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { package: packageId, planner, date, message } = req.body;
    const client = req.user.id;

    // Validate required fields
    if (!packageId || !planner || !date) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    // Enforce plan booking limit
    const user = await User.findById(client).populate("plan");
    const plan = user.plan;
    const maxBookings = plan?.features?.maxBookingsPerMonth ?? 1;
    // Count bookings for this client in the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    const monthlyCount = await Booking.countDocuments({
      client,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });
    if (monthlyCount >= maxBookings) {
      return res.status(403).json({
        success: false,
        message: `You have reached your monthly booking limit (${maxBookings}) for your current plan. Please upgrade your plan to book more events.`,
        upgradePrompt: true,
      });
    }

    // Normalize date to start of day UTC
    const eventDate = new Date(date);
    eventDate.setUTCHours(0, 0, 0, 0);

    // Check if package exists
    const pkg = await EventPackage.findById(packageId);
    if (!pkg) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found." });
    }

    // Check if planner exists
    const plannerUser = await User.findById(planner);
    if (
      !plannerUser ||
      (plannerUser.role !== "planner" && plannerUser.role !== "admin")
    ) {
      return res
        .status(404)
        .json({ success: false, message: "Planner not found!." });
    }

    // Prevent duplicate booking for same client/package (any date)
    const existing = await Booking.findOne({
      client,
      package: packageId,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already booked this package.",
      });
    }

    const booking = await Booking.create({
      client,
      planner,
      package: packageId,
      date: eventDate,
      message,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings for the logged-in client
const getClientBookings = async (req, res) => {
  try {
    const clientId = req.user.id;
    const bookings = await Booking.find({ client: clientId })
      .populate("package")
      .populate("planner", "username email")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings for the logged-in planner (or all for admin)
const getPlannerBookings = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      // Admin: see all bookings
      const bookings = await Booking.find()
        .populate("package")
        .populate("client", "username email")
        .sort({ createdAt: -1 });
      return res.json({ success: true, bookings });
    }
    // Planner: see bookings for their packages
    const plannerId = req.user.id;
    const bookings = await Booking.find({ planner: plannerId })
      .populate("package")
      .populate("client", "username email")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get booking details by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("package")
      .populate("client", "username email")
      .populate("planner", "username email");
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status (accept/reject/complete/cancel)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = [
      "pending",
      "accepted",
      "rejected",
      "completed",
      "cancelled",
    ];
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status." });
    }
    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }

    // Restrict who can update which statuses
    if (status === "cancelled") {
      // Only the client who made the booking can cancel
      if (
        req.user.role !== "client" ||
        booking.client.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Only the booking client can cancel this booking.",
        });
      }
      // Delete the booking from the database
      await booking.deleteOne();
      return res.json({
        success: true,
        message: "Booking cancelled and deleted.",
      });
    } else {
      // Only planner or admin can accept/reject/complete
      if (req.user.role !== "planner" && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only planners or admins can update this status.",
        });
      }
      // Optionally, only the assigned planner or admin can update
      if (
        req.user.role === "planner" &&
        booking.planner.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not the assigned planner for this booking.",
        });
      }
    }

    booking.status = status;
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getClientBookings,
  getPlannerBookings,
  getBookingById,
  updateBookingStatus,
};
