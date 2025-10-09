const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name:{type:String},
  mobile:{type:String},
  isSuperUser:{type:Boolean,default:false}
},{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);