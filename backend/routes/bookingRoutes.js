const express = require("express");
const router = express.Router();
const {
  createBooking,
  getClientBookings,
  getPlannerBookings,
  getBookingById,
  updateBookingStatus,
} = require("../controllers/bookingController");
const protect = require("../middleware/auth");
const setRole = require("../middleware/roleCheck");

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking management endpoints
 */

/**
 * @swagger
 * /bookings/create:
 *   post:
 *     summary: Create a new booking (client/admin)
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventPackageId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/create", protect, setRole("client", "admin"), createBooking);

/**
 * @swagger
 * /bookings/my:
 *   get:
 *     summary: Get all bookings for the logged-in client
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of client bookings
 *       401:
 *         description: Unauthorized
 */
router.get("/my", protect, setRole("client"), getClientBookings);

/**
 * @swagger
 * /bookings/for-planner:
 *   get:
 *     summary: Get all bookings for the logged-in planner (or all for admin)
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of planner bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/for-planner",
  protect,
  setRole("planner", "admin"),
  getPlannerBookings
);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking details by ID (all roles)
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.get("/:id", protect, getBookingById);

/**
 * @swagger
 * /bookings/{id}:
 *   patch:
 *     summary: Update booking status (client/planner/admin)
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.patch(
  "/:id",
  protect,
  setRole("client", "planner", "admin"),
  updateBookingStatus
);

module.exports = router;
