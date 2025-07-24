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

// Public: Get all plans
router.get("/", getAllPlans);
// Admin: Create plan
router.post("/", protect, allowRoles("admin"), createPlan);
// Admin: Update plan
router.put("/:id", protect, allowRoles("admin"), updatePlan);
// Admin: Delete plan
router.delete("/:id", protect, allowRoles("admin"), deletePlan);

module.exports = router;
