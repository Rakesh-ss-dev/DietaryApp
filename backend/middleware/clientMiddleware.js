const jwt = require("jsonwebtoken");
const Client = require("../models/Client");
require("dotenv").config();

const clientMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    const cleanToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = await Client.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = clientMiddleware;
