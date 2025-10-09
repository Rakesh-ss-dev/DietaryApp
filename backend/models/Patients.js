const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    countryCode: { type: String, default: "+91", trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    paymentId: { type: String, required: false, unique: true, sparse: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    discount: { type: Number, default: 0 },
    installment: { type: String, default: "", trim: true },
    notified: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    status: { type: String, default: "created" },
    currency: { type: String, default: "INR" },
    method: { type: String, default: "" },
    password: { type: String, default: "" },
    email: { type: String, default: "" },
    date_of_birth: { type: Date, default: "" },
    bloodGroup: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female"] },
    payed_at: { type: Date },
    activated_at: { type: Date },
    programStartDate: { type: Date },
    dueAmount: { type: Number, default: 0 },
    tax: { type: Number, default: 0.18 },
    cause: { type: [String], default: [] },
    ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
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

PatientSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("Patient", PatientSchema);
