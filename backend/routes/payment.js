const express = require("express");
const Package = require("../models/Package");
const Client = require("../models/Client");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const HealthReport = require("../models/HealthReport");
const router = express.Router();

require("dotenv").config();
const { console } = require("inspector");

// Generate Razorpay Payment Link
router.post("/create-client", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      city,
      phone,
      category,
      programStartDate,
      cause,
      referrerPhone,
      countryCode,
    } = req.body;

    // 1) Validate package exists
    const category_from_db = await Package.findOne({ name: category });
    if (!category_from_db) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid package selected" });
    }

    const ref = await Client.findOne({ phone: referrerPhone });

    // 4) Persist
    const patient = new Client({
      name,
      phone,
      countryCode,
      city,
      package: category_from_db,
      createdBy: req.user,
      programStartDate,
      cause,
      ref,
    });
    await patient.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Payment link error:", error);
    res.status(500).json({
      success: false,
      message: error?.error?.description || error.message,
    });
  }
});

router.get("/get_clients", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Client.find({})
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Client.find({
        createdBy: userData._id,
        status: "paid",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/getRequests/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await Client.findById(userId).populate("package").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const requests = await HealthReport.find({ userId: user._id });
    res.status(200).json({ requests, user });
  } catch (error) {
    console.error("Error fetching health reports:", error);
    res.status(500).json({
      message: "Failed to fetch health reports",
      error: error.message,
    });
  }
});

router.get("/health-metrics/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await Client.findById(userId).populate("package").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const latest = await HealthReport.findOne({ userId: user._id })
      .sort({ date: -1 })
      .exec();
    res.status(200).json({ latest, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the report", error });
  }
});

module.exports = router;
