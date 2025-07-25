const express = require("express");
const router = express.Router();
const { getAnalyticsOverview } = require("../controllers/analyticsController");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/roleCheck");

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics endpoints
 */

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get analytics overview (planner/admin)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics overview data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/overview",
  protect,
  allowRoles("planner", "admin"),
  getAnalyticsOverview
);

module.exports = router;
