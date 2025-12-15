const express = require("express");
const router = express.Router();
const Package = require("../models/Package");
const authMiddleware = require("../middleware/clientMiddleware");
const bcrypt = require("bcryptjs");

router.get("/list", authMiddleware, async (req, res) => {
  try {
    const packages = await Package.find({});
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/details/:packageId", authMiddleware, async (req, res) => {
  try {
    const { packageId } = req.params;
    const package = await Package.findById(packageId);
    res.status(200).json(package);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/edit/:packageId", authMiddleware, async (req, res) => {
  try {
    const { name, price } = req.body;
    const { packageId } = req.params;
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }
    if (name) package.name = name;
    if (price) package.price = price;
    await package.save();
    res.json(package);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/delete/:packageId", authMiddleware, async (req, res) => {
  try {
    const { packageId } = req.params;
    await Package.findByIdAndDelete(packageId);
    res.status(200).json({ message: "Gym Deleted Successfully !!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, price } = req.body;
    const existingPackage = await Package.findOne({ name });
    if (existingPackage) {
      return res
        .status(400)
        .json({ message: "Package with this name already exists" });
    }
    const newPackage = new Package({
      name,
      price,
    });
    await newPackage.save();
    res.status(201).json({ message: "Gym added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
