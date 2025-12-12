const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/list", authMiddleware, async (req, res) => {
  try {
    const gyms = await User.find({ accessModule: "Trainer" })
      .select("-password")
      .populate("assignedTo");
    res.status(200).json(gyms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/details/:trainerId", authMiddleware, async (req, res) => {
  try {
    const { trainerId } = req.params;
    const trainer = await User.findById(trainerId).select("-password");
    res.status(200).json(trainer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/edit/:trainerId", authMiddleware, async (req, res) => {
  try {
    const { name, mobile, email, assignedTo } = req.body;
    const { trainerId } = req.params;
    const trainer = await User.findById(trainerId).select("-password");
    if (!trainer) {
      return res.status(404).json({ error: "Gym not found" });
    }
    if (name) trainer.name = name;
    if (mobile) trainer.mobile = mobile;
    if (email) trainer.email = email;
    if (assignedTo) trainer.location = assignedTo;
    await trainer.save();
    res.json(trainer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/delete/:trainerId", authMiddleware, async (req, res) => {
  try {
    const { trainerId } = req.params;
    await User.findByIdAndDelete(trainerId);
    res.status(200).json({ message: "Trainer Deleted Successfully !!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, mobile, password, email, assignedTo } = req.body;
    const existingMobile = await User.findOne({ mobile });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    if (existingMobile) {
      return res
        .status(400)
        .json({ message: "User with this mobile already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      mobile,
      password: hashedPassword,
      email,
      accessModule: "Trainer",
      assignedTo,
    });
    await newUser.save();
    res.status(201).json({ message: "Trainer added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
