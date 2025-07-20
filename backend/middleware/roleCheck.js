const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("allowRoles debug:", { user: req.user, allowedRoles });
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions!" });
    }
    next();
  };
};

module.exports = allowRoles;
