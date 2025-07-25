const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  getAllContactMessages,
} = require("../controllers/contactMessageController");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/roleCheck");

/**
 * @swagger
 * tags:
 *   name: ContactMessage
 *   description: Contact message endpoints
 */

/**
 * @swagger
 * /contact-messages/:
 *   post:
 *     summary: Submit a contact message (client/planner)
 *     tags: [ContactMessage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact message submitted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  protect,
  allowRoles("client", "planner"),
  createContactMessage
);

/**
 * @swagger
 * /contact-messages/:
 *   get:
 *     summary: Get all contact messages (admin only)
 *     tags: [ContactMessage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contact messages
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", protect, allowRoles("admin"), getAllContactMessages);

module.exports = router;
