const mongoose = require('mongoose');

const HealthReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    enum: ['Underweight', 'Normal', 'Overweight', 'Obese'],
  },
  vitamins: {
    vitaminD: {
      type: Number,
      required: true,
    },
    vitaminB12: {
      type: Number,
      required: true,
    },
    iron: {
      type: Number,
      required: true,
    },
  },
  diabetesAndLipidProfile: {
    hba1c: {
      type: Number,
      required: true,
    },
    triglycerides: {
      type: Number,
      required: true,
    },
    hdl: {
      type: Number,
      required: true,
    },
  },
  thyroidAndUricAcid: {
    tsh: {
      type: Number,
      required: true,
    },
    uricAcid: {
      type: Number,
      required: true,
    },
  },
});

HealthReportSchema.pre('save', function (next) {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    const bmi = this.weight / (heightInMeters ** 2);
    this.bmi = +bmi.toFixed(2);

    // Set BMI Status
    if (bmi < 18.5) {
      this.bmiStatus = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      this.bmiStatus = 'Normal';
    } else if (bmi >= 25 && bmi < 30) {
      this.bmiStatus = 'Overweight';
    } else {
      this.bmiStatus = 'Obese';
    }
  }
  next();
});

module.exports = mongoose.model('HealthReport', HealthReportSchema);
