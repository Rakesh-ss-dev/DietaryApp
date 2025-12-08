const express = require("express");
const router = express.Router();
const HealthReport = require("../models/HealthReport");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add-values/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const date = new Date();
  try {
    const {
      height,
      weight,
      chest,
      waist,
      biceps,
      hips,
      systolic,
      diastolic,
      fasting,
      postMeal,
    } = req.body;

    const report = new HealthReport({
      userId,
      date,
      height,
      weight,
      chest,
      waist,
      biceps,
      hips,
      bloodPressure: { systolic, diastolic },
      sugarLevels: { fasting, postMeal },
    });
    await report.save();
    res.status(201).json({ message: "Report Submitted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save health report", error });
  }
});

module.exports = router;
