const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  isAuthenticated,
} = require("../controllers/authController");
const protect = require("../middleware/auth");

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/is-auth", protect, isAuthenticated);

module.exports = router;
