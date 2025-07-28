const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const emailService = require("../utils/emailService");

//register logic
const signup = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    if (!username || !password || !email || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details!" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Cookie settings that work for both localhost and production
    const cookieOptions = {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set secure and sameSite based on environment
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "None";
    } else {
      // For localhost development
      cookieOptions.secure = false;
      cookieOptions.sameSite = "Lax";
    }

    res.cookie("token", token, cookieOptions);

    // Send welcome email (don't wait for it to complete)
    emailService.sendWelcomeEmail(email, username).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token, // <-- add token here
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//login logic
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Cookie settings that work for both localhost and production
    const cookieOptions = {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set secure and sameSite based on environment
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "None";
    } else {
      // For localhost development
      cookieOptions.secure = false;
      cookieOptions.sameSite = "Lax";
    }

    res.cookie("token", token, cookieOptions);
    res.json({ success: true, message: "Login successful!", token }); // <-- add token here
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//logout logic
const logout = (req, res) => {
  // Cookie settings that work for both localhost and production
  const cookieOptions = {
    httpOnly: true,
  };

  // Set secure and sameSite based on environment
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "None";
  } else {
    // For localhost development
    cookieOptions.secure = false;
    cookieOptions.sameSite = "Lax";
  }

  res.clearCookie("token", cookieOptions);
  res.json({ success: true, message: "Logged out successfully" });
};

//check authentication status
const isAuthenticated = async (req, res) => {
  try {
    // The protect middleware has already verified the token and set req.user
    // If we reach here, the user is authenticated
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User is authenticated",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user._id, type: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send password reset email
    const emailResult = await emailService.sendPasswordReset(email, resetToken);

    if (emailResult.success) {
      res.json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send password reset email. Please try again.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "password_reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    // Find user and update password
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message:
        "Password has been reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  isAuthenticated,
  requestPasswordReset,
  resetPassword,
};
