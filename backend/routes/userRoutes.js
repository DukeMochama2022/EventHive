const express = require("express");

const router = express.Router();
const protect = require("../middleware/auth");
const {
  getUserData,
  getAllUsers,
  deleteUser,
  updateUserPlan,
  updateUserRole,
} = require("../controllers/userController");
const allowRoles = require("../middleware/roleCheck");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * /user/data:
 *   get:
 *     summary: Get current user data
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/data", protect, getUserData);

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", protect, allowRoles("admin"), getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

/**
 * @swagger
 * /user/plan:
 *   patch:
 *     summary: Update user's plan
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User plan updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.patch("/plan", protect, updateUserPlan);

/**
 * @swagger
 * /user/{id}/role:
 *   patch:
 *     summary: Update user role (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [client, planner, admin]
 *                 description: New role for the user
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid input or cannot change own role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch("/:id/role", protect, allowRoles("admin"), updateUserRole);

module.exports = router;
