const express = require("express");
const Package = require("../models/Package");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { name, amount, currency } = req.body;
  try {
    let pack = await Package.findOne({ name });
    if (pack) return res.status(400).json({ error: "Package already exists" });
    pack = new Package({ name, amount, currency });
    await pack.save();
    res.json({ message: "Package created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/get-packages", async (req, res) => {
  try {
    const packages = await Package.find();
    res.json({ packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
