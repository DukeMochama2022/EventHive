const News = require("../models/News");
const User = require("../models/User");

// Get all published news (public)
const getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, search, featured } = req.query;

    const query = { status: "published" };

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Filter by featured
    if (featured === "true") {
      query.featured = true;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const news = await News.find(query)
      .populate("author", "username")
      .sort({ publishedAt: -1, featured: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.json({
      success: true,
      data: news,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single news article (public)
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id)
      .populate("author", "username")
      .where({ status: "published" });

    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.json({ success: true, data: news });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get featured news (public)
const getFeaturedNews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const news = await News.find({
      status: "published",
      featured: true,
    })
      .populate("author", "username")
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: news });
  } catch (error) {
    console.error("Error fetching featured news:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create news (admin only)
const createNews = async (req, res) => {
  try {
    const { title, content, summary, image, tags, status, featured } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Handle tags - could be string or array
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        processedTags = tags.map((tag) => tag.trim());
      } else if (typeof tags === "string") {
        processedTags = tags.split(",").map((tag) => tag.trim());
      }
    }

    const news = await News.create({
      title,
      content,
      summary,
      image,
      tags: processedTags,
      status: status || "published",
      featured: featured || false,
      author: req.user.id,
    });

    await news.populate("author", "username");

    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: news,
    });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update news (admin only)
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, image, tags, status, featured } = req.body;

    const news = await News.findById(id);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }

    // Only allow admin to update
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (summary !== undefined) updateData.summary = summary;
    if (image !== undefined) updateData.image = image;
    if (tags !== undefined) {
      // Handle tags - could be string or array
      if (Array.isArray(tags)) {
        updateData.tags = tags.map((tag) => tag.trim());
      } else if (typeof tags === "string") {
        updateData.tags = tags.split(",").map((tag) => tag.trim());
      } else {
        updateData.tags = [];
      }
    }
    if (status) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;

    const updatedNews = await News.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("author", "username");

    res.json({
      success: true,
      message: "News updated successfully",
      data: updatedNews,
    });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete news (admin only)
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }

    // Only allow admin to delete
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await News.findByIdAndDelete(id);

    res.json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all news for admin management
const getAllNewsForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const news = await News.find(query)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.json({
      success: true,
      data: news,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching news for admin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single news for admin editing
const getNewsByIdForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id).populate("author", "username");

    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }

    res.json({ success: true, data: news });
  } catch (error) {
    console.error("Error fetching news for admin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  getFeaturedNews,
  createNews,
  updateNews,
  deleteNews,
  getAllNewsForAdmin,
  getNewsByIdForAdmin,
};
