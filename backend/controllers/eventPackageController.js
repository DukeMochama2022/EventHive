const EventPackage = require("../models/EventPackage");
const User = require("../models/User");
const Plan = require("../models/Plan");

// Create a new event package
const createEventPackage = async (req, res) => {
  try {
    const { title, description, price, category, image, location } = req.body;
    // The planner is the logged-in user (assume req.user.id is set by auth middleware)
    const planner = req.user.id;

    // Enforce plan package limit
    const user = await User.findById(planner).populate("plan");
    const plan = user.plan;
    const maxPackages = plan?.features?.maxPackages ?? 1;
    const packageCount = await EventPackage.countDocuments({ planner });
    if (packageCount >= maxPackages) {
      return res.status(403).json({
        success: false,
        message: `You have reached your package limit (${maxPackages}) for your current plan. Please upgrade your plan to create more packages.`,
        upgradePrompt: true,
      });
    }

    const imageUrl = req.file?.path;

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !imageUrl ||
      !location
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!." });
    }

    const newPackage = new EventPackage({
      title,
      description,
      price,
      category,
      image: imageUrl,
      location,
      planner,
    });
    await newPackage.save();
    res.status(201).json({
      success: true,
      message: "package created successifuly!",
      data: newPackage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllEventPackages = async (req, res) => {
  try {
    const packages = await EventPackage.find()
      .populate("category", "name")
      .populate("planner", "_id username");
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEventPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const eventPackage = await EventPackage.findById(id)
      .populate("category", "name")
      .populate("planner", "_id email username");
    if (!eventPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found." });
    }
    res.json({ success: true, data: eventPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEventPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, location } = req.body;
    const eventPackage = await EventPackage.findById(id);
    if (!eventPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found." });
    }
    // Only the planner who created the package or an admin can update
    if (
      eventPackage.planner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized." });
    }
    if (title) eventPackage.title = title;
    if (description) eventPackage.description = description;
    if (price) eventPackage.price = price;
    if (category) eventPackage.category = category;
    if (location) eventPackage.location = location;
    // Handle image update if a new file is uploaded
    if (req.file && req.file.path) {
      eventPackage.image = req.file.path;
    }
    await eventPackage.save();
    res.json({ success: true, data: eventPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEventPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const eventPackage = await EventPackage.findById(id);
    if (!eventPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found." });
    }
    // Only the planner who created the package or an admin can delete
    if (
      eventPackage.planner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized." });
    }
    await eventPackage.deleteOne();
    res.json({ success: true, message: "Package deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEventPackage,
  getAllEventPackages,
  getEventPackageById,
  updateEventPackage,
  deleteEventPackage,
};
