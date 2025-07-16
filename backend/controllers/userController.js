const User = require("../models/User");

const getUserData = async (req, res) => {
  try {
    // Get userId from req.user (set by protect middleware)
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    res.json({
      success: true,
      userData: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = getUserData;
