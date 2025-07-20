const express = require("express");
const router = express.Router();
const {
  addReview,
  getPackageReviews,
  editReview,
  deleteReview,
} = require("../controllers/reviewController");
const protect = require("../middleware/auth");
const setRole = require("../middleware/roleCheck");

// Add a review (client only)
router.post("/", protect, setRole("client"), addReview);

// Get all reviews for a package
router.get("/:packageId", getPackageReviews);

// Edit a review (client only, only their own)
router.patch("/:id", protect, setRole("client"), editReview);
// Delete a review (client only, only their own)
router.delete("/:id", protect, setRole("client"), deleteReview);

module.exports = router;
