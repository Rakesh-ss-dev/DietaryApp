const mongoose = require("mongoose");

const HealthReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  height: {
    type: Number, // cm
  },
  weight: {
    type: Number, // kg
  },
  bmi: {
    type: Number,
  },
  bmiStatus: {
    type: String,
    enum: ["Underweight", "Normal", "Overweight", "Obese"],
  },
  chest: {
    type: Number, // cm
  },
  waist: {
    type: Number, // cm
  },
  biceps: {
    type: Number, // cm
  },
  hips: {
    type: Number, // cm
  },
  bloodPressure: {
    systolic: {
      type: Number,
    },
    diastolic: {
      type: Number,
    },
  },
  sugarLevels: {
    fasting: {
      type: Number,
    },
    postMeal: {
      type: Number,
    },
  },
});

HealthReportSchema.pre("save", function (next) {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    const bmi = this.weight / heightInMeters ** 2;
    this.bmi = +bmi.toFixed(2);

    // Set BMI Status
    if (bmi < 18.5) {
      this.bmiStatus = "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      this.bmiStatus = "Normal";
    } else if (bmi >= 25 && bmi < 30) {
      this.bmiStatus = "Overweight";
    } else {
      this.bmiStatus = "Obese";
    }
  }
  next();
});

module.exports = mongoose.model("HealthReport", HealthReportSchema);
