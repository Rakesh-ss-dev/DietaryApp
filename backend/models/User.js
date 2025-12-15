const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: String,
    name: { type: String },
    mobile: { type: String, required: true, unique: true },
    location: { type: String },
    height: { type: Number }, // in cm
    profileImage: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isSuperUser: { type: Boolean, default: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    accessModule: {
      type: String,
      enum: ["Gym", "Trainer", "SuperAdmin"],
      default: "Trainer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
