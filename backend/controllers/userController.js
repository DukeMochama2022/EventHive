const User = require("../models/User");
const EventPackage = require("../models/EventPackage");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Message = require("../models/Message");
const Plan = require("../models/Plan");
const cloudinary = require("../utils/cloudinary");

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
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        profilePicture: user.profilePicture,
        location: user.location,
        website: user.website,
        socialMedia: user.socialMedia,
        specialization: user.specialization,
        experience: user.experience,
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

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      phoneNumber,
      bio,
      location,
      website,
      socialMedia,
      specialization,
      experience,
    } = req.body;

    const updateData = {
      firstName,
      lastName,
      phoneNumber,
      bio,
      location,
      website,
      socialMedia,
      specialization,
      experience,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).populate("plan");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        profilePicture: user.profilePicture,
        location: user.location,
        website: user.website,
        socialMedia: user.socialMedia,
        specialization: user.specialization,
        experience: user.experience,
        plan: user.plan ? { _id: user.plan._id, name: user.plan.name } : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile-pictures",
      width: 400,
      height: 400,
      crop: "fill",
    });

    // Update user profile picture
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true }
    ).populate("plan");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: result.secure_url,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        profilePicture: user.profilePicture,
        location: user.location,
        website: user.website,
        socialMedia: user.socialMedia,
        specialization: user.specialization,
        experience: user.experience,
        plan: user.plan ? { _id: user.plan._id, name: user.plan.name } : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user profile by ID (public)
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select(
      "username firstName lastName bio profilePicture location website socialMedia specialization experience role"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      profile: user,
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
  updateUserProfile,
  uploadProfilePicture,
  getUserProfile,
};
