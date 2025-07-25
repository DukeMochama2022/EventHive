const express = require("express");
const router = express.Router();

const upload = require("../utils/multer");

const {
  createEventPackage,
  getAllEventPackages,
  getEventPackageById,
  updateEventPackage,
  deleteEventPackage,
} = require("../controllers/eventPackageController");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/roleCheck");

/**
 * @swagger
 * tags:
 *   name: EventPackage
 *   description: Event package management endpoints
 */

/**
 * @swagger
 * /event-packages/create:
 *   post:
 *     summary: Create a new event package (planner/admin)
 *     tags: [EventPackage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event package created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/create",
  protect,
  allowRoles("admin", "planner"),
  upload.single("image"),
  createEventPackage
);

/**
 * @swagger
 * /event-packages/:
 *   get:
 *     summary: List all event packages
 *     tags: [EventPackage]
 *     responses:
 *       200:
 *         description: List of event packages
 */
router.get("/", getAllEventPackages);

/**
 * @swagger
 * /event-packages/{id}:
 *   get:
 *     summary: Get event package by ID
 *     tags: [EventPackage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event package ID
 *     responses:
 *       200:
 *         description: Event package details
 *       404:
 *         description: Event package not found
 */
router.get("/:id", getEventPackageById);

/**
 * @swagger
 * /event-packages/update/{id}:
 *   put:
 *     summary: Update an event package (planner/admin)
 *     tags: [EventPackage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event package ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Event package updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event package not found
 */
router.put(
  "/update/:id",
  protect,
  allowRoles("admin", "planner"),
  upload.single("image"),
  updateEventPackage
);

/**
 * @swagger
 * /event-packages/delete/{id}:
 *   delete:
 *     summary: Delete an event package (planner/admin)
 *     tags: [EventPackage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event package ID
 *     responses:
 *       200:
 *         description: Event package deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event package not found
 */
router.delete(
  "/delete/:id",
  protect,
  allowRoles("admin", "planner"),
  deleteEventPackage
);

module.exports = router;
