const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  console.log("Auth middleware - Token:", token ? "Present" : "Missing");
  console.log("Auth middleware - Cookies:", req.cookies);
  console.log("Auth middleware - Headers:", req.headers.authorization);

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Access denied, login now!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Auth middleware - Decoded user:", decoded);
    next();
  } catch (error) {
    console.error("Auth middleware - Token verification failed:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = protect;
