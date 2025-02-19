const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUser = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ error: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ error: "User not found." });

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};
