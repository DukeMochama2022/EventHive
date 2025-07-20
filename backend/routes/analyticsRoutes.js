const express = require("express");
const router = express.Router();
const { getAnalyticsOverview } = require("../controllers/analyticsController");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/roleCheck");

router.get(
  "/overview",
  protect,
  allowRoles("planner", "admin"),
  getAnalyticsOverview
);

module.exports = router;
