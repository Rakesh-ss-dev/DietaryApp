const mongoose = require("mongoose");

const DiabetesSchema = mongoose.Schema(
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
    fastingValue: {
      type: Number,
      required: true,
    },
    randomValue: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diabetes", DiabetesSchema);
