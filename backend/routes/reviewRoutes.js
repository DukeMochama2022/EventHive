const express = require("express");
const router = express.Router();
const {
  addReview,
  getPackageReviews,
  editReview,
  deleteReview,
  getUserReviews,
} = require("../controllers/reviewController");
const protect = require("../middleware/auth");
const setRole = require("../middleware/roleCheck");

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review management endpoints
 */

/**
 * @swagger
 * /reviews/:
 *   post:
 *     summary: Add a review (client only)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packageId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", protect, setRole("client"), addReview);

/**
 * @swagger
 * /reviews/user/{userId}:
 *   get:
 *     summary: Get all reviews by a user
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of reviews by user
 *       404:
 *         description: User not found
 */
router.get("/user/:userId", getUserReviews);

/**
 * @swagger
 * /reviews/{packageId}:
 *   get:
 *     summary: Get all reviews for a package
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: packageId
 *         schema:
 *           type: string
 *         required: true
 *         description: Event package ID
 *     responses:
 *       200:
 *         description: List of reviews
 *       404:
 *         description: Package not found
 */
router.get("/:packageId", getPackageReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Edit a review (client only, only their own)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 */
router.patch("/:id", protect, setRole("client"), editReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review (client only, only their own)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 */
router.delete("/:id", protect, setRole("client"), deleteReview);

module.exports = router;
