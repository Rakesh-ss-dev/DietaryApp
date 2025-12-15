const mongoose = require("mongoose");

const HealthReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // Measurements (Metric System defaults implied)
    height: {
      type: Number, // stored in cm
      min: [0, "Height cannot be negative"],
    },
    weight: {
      type: Number, // stored in kg
      min: [0, "Weight cannot be negative"],
    },
    // BMI fields are strictly Number/String but populated via pre-save hook
    bmi: {
      type: Number,
    },
    bmiStatus: {
      type: String,
      enum: ["Underweight", "Normal", "Overweight", "Obese"],
    },
    // Body Measurements
    measurements: {
      chest: { type: Number, min: 0 },
      waist: { type: Number, min: 0 },
      biceps: { type: Number, min: 0 },
      hips: { type: Number, min: 0 },
    },
    bloodPressure: {
      systolic: { type: Number, min: 0 },
      diastolic: { type: Number, min: 0 },
    },
    sugarLevels: {
      fasting: { type: Number, min: 0 }, // mg/dL
      postMeal: { type: Number, min: 0 }, // mg/dL
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// 1. COMPOUND INDEX: Optimized for fetching a user's history sorted by date
HealthReportSchema.index({ userId: 1, date: -1 });

// 2. PRE-SAVE HOOK: Auto-calculate BMI
HealthReportSchema.pre("save", function (next) {
  // Only run if weight and height are present and modified
  if (
    (this.isModified("weight") || this.isModified("height")) &&
    this.weight &&
    this.height
  ) {
    // BMI Formula: weight (kg) / [height (m)]^2
    const heightInMeters = this.height / 100;
    const bmiValue = (this.weight / (heightInMeters * heightInMeters)).toFixed(
      1
    );

    this.bmi = parseFloat(bmiValue);

    // Set BMI Status
    if (this.bmi < 18.5) this.bmiStatus = "Underweight";
    else if (this.bmi < 24.9) this.bmiStatus = "Normal";
    else if (this.bmi < 29.9) this.bmiStatus = "Overweight";
    else this.bmiStatus = "Obese";
  }
  next();
});

module.exports = mongoose.model("HealthReport", HealthReportSchema);
