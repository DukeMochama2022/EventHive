const express = require("express");

const router = express.Router();
const protect = require("../middleware/auth");
const getUserData = require("../controllers/userController");

router.get("/data", protect, getUserData);

module.exports = router;
