const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // 1. Cleaner token extraction (Handles generic "Bearer " issues)
    const cleanToken = token.replace("Bearer ", "").trim();

    // 2. Verify Token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    // 3. Check for User
    // If this fails, the console.log below will tell us why (e.g., User is not a function)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Token valid, but User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    // 4. LOG THE ERROR TO SEE IT IN YOUR TERMINAL
    console.error("Auth Middleware Error:", error.message);

    // If the error is 'jwt expired', tell the frontend specifically
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

module.exports = authMiddleware;
