const Review = require("../models/Review");
const Booking = require("../models/Booking");

// Add a review (client only, one per package per client)
const addReview = async (req, res) => {
  try {
    const { package: packageId, rating, comment } = req.body;
    const client = req.user.id;
    if (!packageId || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Package and rating are required." });
    }
    // Check if client has booked this package
    const hasBooked = await Booking.findOne({ client, package: packageId });
    if (!hasBooked) {
      return res.status(403).json({
        success: false,
        message: "You can only review packages you have booked.",
      });
    }
    // Prevent multiple reviews per package per client
    const existing = await Review.findOne({ client, package: packageId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this package.",
      });
    }
    const review = await Review.create({
      package: packageId,
      client,
      rating,
      comment,
    });
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews for a package
const getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params;
    const reviews = await Review.find({ package: packageId })
      .populate("client", "username")
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit a review (client only, only their own)
const editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }
    if (review.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own review.",
      });
    }
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review (client only, only their own)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }
    if (review.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review.",
      });
    }
    await review.deleteOne();
    res.json({ success: true, message: "Review deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addReview, getPackageReviews, editReview, deleteReview };
