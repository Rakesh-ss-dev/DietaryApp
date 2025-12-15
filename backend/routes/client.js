const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const HealthReport = require("../models/HealthReport");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      phone,
      city,
      package,
      cause,
      trainer,
      email,
      date_of_birth,
      gender,
      bloodGroup,
      height,
    } = req.body;
    let client = await Client.findOne({ phone });
    if (client) {
      return res.status(400).json({ error: "User already exists." });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({ error: "Email Already Exists" });
    }
    client = new Client({
      name,
      phone,
      city,
      package,
      cause,
      trainer,
      email,
      date_of_birth,
      gender,
      bloodGroup,
      height,
      createdBy: req.user,
    });
    await client.save();
    res.status(201).json({ message: "Client registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/details/:clientId", authMiddleware, async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const client = await Client.findById(clientId)
      .populate(["createdBy", "package", "trainer"])
      .select("-password")
      .exec();
    delete client?.createdBy?.password;
    delete client?.trainer?.password;
    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/reports/:clientId", authMiddleware, async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const reports = await HealthReport.find({ userId: clientId });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/list", authMiddleware, async (req, res) => {
  try {
    let clients;
    if (req.user.isSuperUser) {
      clients = await Client.find()
        .select("-password")
        .populate(["createdBy", "package", "trainer"]);
    } else if (req.user.accessModule === "Trainer") {
      const user = await User.findById(req.user._id);
      console.log("Trainer User:", user);
      clients = await Client.find({ trainer: req.user._id })
        .select("-password")
        .populate(["createdBy", "package", "trainer"]);
    } else {
      const trainerIds = await User.find({ assignedTo: req.user._id }).select(
        "_id"
      );
      clients = await Client.find({ trainer: { $in: trainerIds } })
        .select("-password")
        .populate(["createdBy", "package", "trainer"]);
    }
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/health-report", authMiddleware, async (req, res) => {
  try {
    const { clientId, date, ...metrics } = req.body;

    // 1. Validate Client ID
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required" });
    }

    // 2. Determine the Date Range (Start of day to End of day)
    // This ensures we only have ONE report per day per user
    const reportDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(reportDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(reportDate.setHours(23, 59, 59, 999));

    // 3. Prepare the Update Object (Dot Notation for Nested Fields)
    // We use dot notation so we don't overwrite the entire nested object if only one field is sent
    const updateData = {};

    // Helper to flatten nested objects for partial updates
    if (metrics.weight) updateData.weight = metrics.weight;
    if (metrics.height) updateData.height = metrics.height;
    if (metrics.bmi) updateData.bmi = metrics.bmi;
    if (metrics.bmiStatus) updateData.bmiStatus = metrics.bmiStatus;

    if (metrics.measurements) {
      if (metrics.measurements.chest)
        updateData["measurements.chest"] = metrics.measurements.chest;
      if (metrics.measurements.waist)
        updateData["measurements.waist"] = metrics.measurements.waist;
      if (metrics.measurements.hips)
        updateData["measurements.hips"] = metrics.measurements.hips;
      if (metrics.measurements.biceps)
        updateData["measurements.biceps"] = metrics.measurements.biceps;
    }

    if (metrics.bloodPressure) {
      if (metrics.bloodPressure.systolic)
        updateData["bloodPressure.systolic"] = metrics.bloodPressure.systolic;
      if (metrics.bloodPressure.diastolic)
        updateData["bloodPressure.diastolic"] = metrics.bloodPressure.diastolic;
    }

    if (metrics.sugarLevels) {
      if (metrics.sugarLevels.fasting)
        updateData["sugarLevels.fasting"] = metrics.sugarLevels.fasting;
      if (metrics.sugarLevels.postMeal)
        updateData["sugarLevels.postMeal"] = metrics.sugarLevels.postMeal;
    }

    // 4. Find One and Update (with Upsert)
    const report = await HealthReport.findOneAndUpdate(
      {
        userId: clientId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
      {
        $set: updateData, // Updates specific fields
        $setOnInsert: {
          // Fields to set ONLY on creation
          client: clientId,
          date: new Date(), // Sets exact time on creation
        },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create if it doesn't exist
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Metrics saved successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error saving metrics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
