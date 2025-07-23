const Booking = require("../models/Booking");
const EventPackage = require("../models/EventPackage");
const User = require("../models/User");
const Review = require("../models/Review");
const ContactMessage = require("../models/ContactMessage");

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

// backend/controllers/contactMessageController.js
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const newMessage = await ContactMessage.create({ name, email, message });
    res
      .status(201)
      .json({
        success: true,
        message: "Message sent successfully!",
        data: newMessage,
      });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message." });
  }
};

exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
};

module.exports = { getAnalyticsOverview };
