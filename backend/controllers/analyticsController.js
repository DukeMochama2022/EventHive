const Booking = require("../models/Booking");
const EventPackage = require("../models/EventPackage");
const User = require("../models/User");
const Review = require("../models/Review");

const getAnalyticsOverview = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let data = {};

    if (role === "admin") {
      // Admin: global stats
      const totalBookings = await Booking.countDocuments();
      const completedBookings = await Booking.countDocuments({
        status: "completed",
      });
      const completed = await Booking.find({ status: "completed" }).populate(
        "package",
        "price"
      );
      const totalRevenue = completed.reduce(
        (sum, b) => sum + (b.package?.price || 0),
        0
      );
      const totalUsers = await User.countDocuments();
      const clients = await User.countDocuments({ role: "client" });
      const planners = await User.countDocuments({ role: "planner" });
      const admins = await User.countDocuments({ role: "admin" });
      const totalPackages = await EventPackage.countDocuments();
      const totalReviews = await Review.countDocuments();
      data = {
        totalBookings,
        completedBookings,
        totalRevenue,
        totalUsers,
        clients,
        planners,
        admins,
        totalPackages,
        totalReviews,
      };
    } else if (role === "planner") {
      // Planners: only their own stats
      // Get package IDs for this planner
      const myPackages = await EventPackage.find({ planner: userId }, "_id");
      const myPackageIds = myPackages.map((p) => p._id);
      // Bookings for their packages
      const totalBookings = await Booking.countDocuments({ planner: userId });
      const completedBookings = await Booking.countDocuments({
        planner: userId,
        status: "completed",
      });
      // Revenue: sum of prices for completed bookings for their packages
      const completed = await Booking.find({
        planner: userId,
        status: "completed",
      }).populate("package", "price");
      const totalRevenue = completed.reduce(
        (sum, b) => sum + (b.package?.price || 0),
        0
      );
      // Their packages
      const totalPackages = myPackages.length;
      // Reviews for their packages
      const totalReviews = await Review.countDocuments({
        package: { $in: myPackageIds },
      });
      // User counts not relevant for planners
      data = {
        totalBookings,
        completedBookings,
        totalRevenue,
        totalUsers: 0,
        clients: 0,
        planners: 0,
        admins: 0,
        totalPackages,
        totalReviews,
      };
    } else {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalyticsOverview };
