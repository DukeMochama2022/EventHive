const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("RoleCheck middleware - User:", req.user);
    console.log("RoleCheck middleware - Allowed roles:", allowedRoles);
    console.log("RoleCheck middleware - User role:", req.user?.role);
    
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log("RoleCheck middleware - Access denied for role:", userRole);
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions!" });
    }
    console.log("RoleCheck middleware - Access granted for role:", userRole);
    next();
  };
};

module.exports = allowRoles;
