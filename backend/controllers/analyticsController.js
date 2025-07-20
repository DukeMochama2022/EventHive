const Booking = require("../models/Booking");
const EventPackage = require("../models/EventPackage");
const User = require("../models/User");
const Review = require("../models/Review");

const getAnalyticsOverview = async (req, res) => {
  try {
    // Total bookings
    const totalBookings = await Booking.countDocuments();
    // Completed bookings
    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });
    // Total revenue (sum of completed bookings' package prices)
    const completed = await Booking.find({ status: "completed" }).populate(
      "package",
      "price"
    );
    const totalRevenue = completed.reduce(
      (sum, b) => sum + (b.package?.price || 0),
      0
    );
    // Total users and breakdown
    const totalUsers = await User.countDocuments();
    const clients = await User.countDocuments({ role: "client" });
    const planners = await User.countDocuments({ role: "planner" });
    const admins = await User.countDocuments({ role: "admin" });
    // Total packages
    const totalPackages = await EventPackage.countDocuments();
    // Total reviews
    const totalReviews = await Review.countDocuments();

    res.json({
      success: true,
      data: {
        totalBookings,
        completedBookings,
        totalRevenue,
        totalUsers,
        clients,
        planners,
        admins,
        totalPackages,
        totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalyticsOverview };
