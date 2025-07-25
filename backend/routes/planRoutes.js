const express = require("express");
const router = express.Router();
const {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} = require("../controllers/planController");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/roleCheck");

/**
 * @swagger
 * tags:
 *   name: Plan
 *   description: Pricing plan endpoints
 */

/**
 * @swagger
 * /plans/:
 *   get:
 *     summary: List all plans
 *     tags: [Plan]
 *     responses:
 *       200:
 *         description: List of plans
 */
router.get("/", getAllPlans);

/**
 * @swagger
 * /plans/:
 *   post:
 *     summary: Create a new plan (admin only)
 *     tags: [Plan]
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
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Plan created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", protect, allowRoles("admin"), createPlan);

/**
 * @swagger
 * /plans/{id}:
 *   put:
 *     summary: Update a plan (admin only)
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Plan updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Plan not found
 */
router.put("/:id", protect, allowRoles("admin"), updatePlan);

/**
 * @swagger
 * /plans/{id}:
 *   delete:
 *     summary: Delete a plan (admin only)
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Plan not found
 */
router.delete("/:id", protect, allowRoles("admin"), deletePlan);

module.exports = router;
