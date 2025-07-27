const User = require("../models/User");
const EventPackage = require("../models/EventPackage");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Message = require("../models/Message");
const Plan = require("../models/Plan");

const getUserData = async (req, res) => {
  try {
    // Get userId from req.user (set by protect middleware)
    const userId = req.user.id;
    const user = await User.findById(userId).populate("plan");

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    res.json({
      success: true,
      userData: {
        _id: user._id, // or id: user._id,
        username: user.username,
        role: user.role,
        plan: user.plan ? { _id: user.plan._id, name: user.plan.name } : null,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id username email role");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user (admin only, with cascade delete)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // If planner, delete their packages and related bookings, reviews, messages
    if (user.role === "planner") {
      const packages = await EventPackage.find({ planner: userId });
      const packageIds = packages.map((pkg) => pkg._id);
      // Delete bookings for these packages
      await Booking.deleteMany({ package: { $in: packageIds } });
      // Delete reviews for these packages
      await Review.deleteMany({ package: { $in: packageIds } });
      // Delete messages where sender or receiver is the planner
      await Message.deleteMany({
        $or: [{ sender: userId }, { receiver: userId }],
      });
      // Delete the packages
      await EventPackage.deleteMany({ planner: userId });
    }
    // If client, delete their bookings, reviews, messages
    if (user.role === "client") {
      await Booking.deleteMany({ client: userId });
      await Review.deleteMany({ client: userId });
      await Message.deleteMany({
        $or: [{ sender: userId }, { receiver: userId }],
      });
    }
    // For all users, delete messages where sender or receiver is the user
    await Message.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }],
    });
    // Finally, delete the user
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "User and related data deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user's plan
const updateUserPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;
    if (!planId) {
      return res
        .status(400)
        .json({ success: false, message: "Plan ID is required." });
    }
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found." });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { plan: planId },
      { new: true }
    ).populate("plan");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Validate role
    if (!["client", "planner", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'client', 'planner', or 'admin'.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from changing their own role
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    // Update the user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("_id username email role");

    res.json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserData,
  getAllUsers,
  deleteUser,
  updateUserPlan,
  updateUserRole,
};
