const express = require("express");
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  getFeaturedNews,
  createNews,
  updateNews,
  deleteNews,
  getAllNewsForAdmin,
  getNewsByIdForAdmin,
} = require("../controllers/newsController");
const protect = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management endpoints
 */

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get all published news articles
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, content, and summary
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured news only
 *     responses:
 *       200:
 *         description: List of news articles
 */
router.get("/", getAllNews);

/**
 * @swagger
 * /news/featured:
 *   get:
 *     summary: Get featured news articles
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of featured articles to return
 *     responses:
 *       200:
 *         description: List of featured news articles
 */
router.get("/featured", getFeaturedNews);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Get a specific news article
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News article ID
 *     responses:
 *       200:
 *         description: News article details
 *       404:
 *         description: News article not found
 */
router.get("/:id", getNewsById);

// Admin routes (protected)
/**
 * @swagger
 * /news/admin/all:
 *   get:
 *     summary: Get all news for admin management
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, content, and summary
 *     responses:
 *       200:
 *         description: List of all news articles
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.get("/admin/all", protect, roleCheck(["admin"]), getAllNewsForAdmin);

/**
 * @swagger
 * /news/admin/{id}:
 *   get:
 *     summary: Get a specific news article for admin editing
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News article ID
 *     responses:
 *       200:
 *         description: News article details
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: News article not found
 */
router.get("/admin/:id", protect, roleCheck(["admin"]), getNewsByIdForAdmin);

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               summary:
 *                 type: string
 *               image:
 *                 type: string
 *               tags:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: News article created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.post("/", protect, roleCheck(["admin"]), createNews);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Update a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               summary:
 *                 type: string
 *               image:
 *                 type: string
 *               tags:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: News article updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: News article not found
 */
router.put("/:id", protect, roleCheck(["admin"]), updateNews);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Delete a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News article ID
 *     responses:
 *       200:
 *         description: News article deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: News article not found
 */
router.delete("/:id", protect, roleCheck(["admin"]), deleteNews);

module.exports = router;
