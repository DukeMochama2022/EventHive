const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  isAuthenticated,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const protect = require("../middleware/auth");
const emailService = require("../utils/emailService");
const User = require("../models/User");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [client, planner, admin]
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/register", signup);

// Test endpoint for registration debugging
router.post("/test-register", async (req, res) => {
  const { username, password, email, role } = req.body;
  
  console.log("Test registration attempt:", { username, email, role });
  
  try {
    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists!",
        debug: "User found in database"
      });
    }
    
    // Test email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format!",
        debug: "Email validation failed"
      });
    }
    
    res.json({ 
      success: true, 
      message: "Registration test passed",
      debug: {
        emailValid: true,
        userExists: false,
        email: email
      }
    });
  } catch (error) {
    console.error("Test registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Test failed",
      debug: error.message
    });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post("/logout", logout);

/**
 * @swagger
 * /auth/is-auth:
 *   get:
 *     summary: Check if the user is authenticated
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Not authenticated
 */
router.get("/is-auth", protect, isAuthenticated);

/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Invalid input
 */
router.post("/request-password-reset", requestPasswordReset);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or input
 */
router.post("/reset-password", resetPassword);

module.exports = router;
