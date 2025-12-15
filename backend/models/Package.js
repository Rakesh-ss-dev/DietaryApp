const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  price: { type: Number },
});

module.exports = mongoose.model("Package", PackageSchema);
