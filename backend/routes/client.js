const express = require("express");
const router = express.Router();
const Patient = require("../models/Patients");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clientMiddleware = require("../middleware/clientMiddleware");
const HealthReport = require("../models/HealthReport");
const DailyWeight = require("../models/DailyWeight");
const Diabetes = require("../models/Diabetes");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, mobile, coachMobile, password } = req.body;

    // Check if user already exists
    let patient = await Patient.findOne({ phone: mobile });
    if (patient) {
      return res.status(400).json({ error: "User already exists." });
    }
    let user = await User.findOne({ mobile: coachMobile });
    if (!user) {
      return res.status(404).json({ error: "Coach not found." });
    }
    patient = new Patient({
      name,
      phone: mobile,
      password: password,
      createdBy: user,
      paymentId: new Date().getTime().toString(),
    });
    await patient.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res
        .status(400)
        .json({ error: "Mobile and password are required." });
    }

    const patient = await Patient.findOne({
      phone: mobile,
    })
      .select("+password")
      .populate(["createdBy", "package"])
      .exec();

    if (!patient) {
      return res.status(401).json({ error: "User not found or inactive." });
    }

    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { password: _, ...patientData } = patient.toObject();

    res.json({ token, patient: patientData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

router.post("/change-password", clientMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both old and new passwords are required." });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters." });
    }

    const patient = await Patient.findById(req.user._id).select("+password");

    if (!patient) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, patient.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password." });
    }

    const isSame = await bcrypt.compare(newPassword, patient.password);
    if (isSame) {
      return res
        .status(400)
        .json({ error: "New password must be different from old password." });
    }

    patient.password = newPassword; // Let the schema hash it
    await patient.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/update", clientMiddleware, async (req, res) => {
  try {
    const { name, dateOfBirth, gender, email, bloodGroup } = req.body;
    const patient = await Patient.findOne({ _id: req.user._id })
      .populate(["createdBy", "package"])
      .exec();
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.name = name;
    patient.date_of_birth = dateOfBirth;
    patient.gender = gender;
    patient.email = email;
    patient.bloodGroup = bloodGroup;
    await patient.save();
    res.status(201).json({ message: "Profile Updated Successfully", patient });
  } catch (err) {
    console.error("Update Error:", err);
    res
      .status(500)
      .json({ message: "Failed to update your Profile", error: err.message });
  }
});

router.post("/addReport", clientMiddleware, async (req, res) => {
  const userId = req.user;
  const date = new Date();
  try {
    const {
      height,
      weight,
      vitaminD,
      vitaminB12,
      iron,
      hba1c,
      triglycerides,
      hdl,
      tsh,
      uricAcid,
    } = req.body;

    const report = new HealthReport({
      userId,
      date,
      height,
      weight,
      vitamins: {
        vitaminD,
        vitaminB12,
        iron,
      },
      diabetesAndLipidProfile: {
        hba1c,
        triglycerides,
        hdl,
      },
      thyroidAndUricAcid: {
        tsh,
        uricAcid,
      },
    });
    const saved = await report.save();
    res.status(201).json({ message: "Report Submitted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save health report", error });
  }
});

router.get("/getRequests", clientMiddleware, async (req, res) => {
  try {
    const requests = await HealthReport.find({ userId: req.user });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to Fetch health reports", error });
  }
});

router.get("/health-metrics", clientMiddleware, async (req, res) => {
  try {
    const latest = await HealthReport.findOne({ userId: req.user })
      .sort({ date: -1 })
      .exec();
    if (!latest) return res.status(404).json({ error: "No data found." });
    res.status(200).json(latest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the report", error });
  }
});
router.post("/weight/submit", clientMiddleware, async (req, res) => {
  const today = new Date();
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  try {
    const { weight } = req.body;
    const user = req.user;
    const weightInput = await DailyWeight.findOneAndUpdate(
      { userId: user, date: dateOnly },
      { $set: { weight: weight } },
      { upsert: true, new: true }
    );
    res
      .status(201)
      .json({ success: true, message: "Weight submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/weights", clientMiddleware, async (req, res) => {
  try {
    const weights = await DailyWeight.find({ userId: req.user }).sort({
      date: 1,
    });
    res.json(weights);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/fastingSugar/submit", clientMiddleware, async (req, res) => {
  const { fastingValue } = req.body;
  const user = req.user;
  const today = new Date();
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  try {
    const fastingInput = await Diabetes.findOneAndUpdate(
      { userId: user, date: dateOnly },
      { $set: { fastingValue: fastingValue } },
      { upsert: true, new: true }
    );
    res.status(201).json({
      success: true,
      message: "Fasting value submitted successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/randomSugar/submit", clientMiddleware, async (req, res) => {
  const { randomValue } = req.body;
  const user = req.user;
  const today = new Date();
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  try {
    const randomInput = await Diabetes.findOneAndUpdate(
      { userId: user, date: dateOnly },
      { $set: { randomValue: randomValue } },
      { upsert: true, new: true }
    );
    console.log(randomValue);
    res
      .status(201)
      .json({ success: true, message: "Random value submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/sugar-values", clientMiddleware, async (req, res) => {
  try {
    const sugar_values = await Diabetes.find({ userId: req.user });
    res.json(sugar_values);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
