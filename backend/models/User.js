const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true  // ✅ Ensures no duplicate emails
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },

  // ✅ New fields for OTP
  resetOtp: {
    type: String,
    default: null
  },
  resetOtpExpires: {
    type: Date,
    default: null
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
