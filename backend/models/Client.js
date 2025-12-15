const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    email: { type: String, default: "", unique: true },
    city: { type: String, default: "", trim: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    status: { type: String, default: "created" },
    password: { type: String, default: "" },
    date_of_birth: { type: Date, default: "" },
    bloodGroup: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female", "Others"] },
    cause: { type: [String], default: [] },
    height: { type: Number, default: 0 }, // in cm
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

ClientSchema.pre("save", async function (next) {
  // Set default password if not provided
  if (!this.password) {
    this.password = process.env.INITIAL_PASS;
  }

  // Only hash if password is modified
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Client", ClientSchema);
