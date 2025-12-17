const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/clientMiddleware");
const bcrypt = require("bcryptjs");

router.get("/list", authMiddleware, async (req, res) => {
  try {
    const gyms = await User.find({ accessModule: "Gym" }).select("-password");
    res.status(200).json(gyms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/details/:gymId", authMiddleware, async (req, res) => {
  try {
    const { gymId } = req.params;
    const gym = await User.findById(gymId).select("-password");
    res.status(200).json(gym);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/edit/:gymId", authMiddleware, async (req, res) => {
  try {
    const { name, mobile, email, location } = req.body;
    const { gymId } = req.params;
    const gym = await User.findById(gymId).select("-password");
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }
    if (name) gym.name = name;
    if (mobile) gym.mobile = mobile;
    if (email) gym.email = email;
    if (location) gym.location = location;
    await gym.save();
    res.json(gym);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/delete/:gymId", authMiddleware, async (req, res) => {
  try {
    const { gymId } = req.params;
    const trainers = await User.find({ assignedTo: gymId });
    for (let trainer of trainers) {
      trainer.assignedTo = null;
      await trainer.save();
    }
    await User.findByIdAndDelete(gymId);
    res.status(200).json({ message: "Gym Deleted Successfully !!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, location, mobile, password, email } = req.body;
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
      location,
      mobile,
      password: hashedPassword,
      email,
      accessModule: "Gym",
    });
    await newUser.save();
    res.status(201).json({ message: "Gym added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
