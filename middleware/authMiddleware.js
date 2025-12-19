const jwt = require("jsonwebtoken");
const User = require("../models/User");

// User authentication
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
//admin auth middleware
const adminAuthMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, async () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admins only" });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid admin token" });
  }
};

module.exports = { authMiddleware,adminAuthMiddleware };
