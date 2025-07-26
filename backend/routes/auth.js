const express = require("express");
const router = express.Router();
const User = require("../models/User");
const OTP = require("../models/otp"); // OTP model
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const nodemailer = require("nodemailer");

const SALT_ROUNDS = 12;
const JWT_ST = "Premkumar";

// Route 1: Create New User
router.post(
  "/createuser",
  [
    body("name", "Enter your name please").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Email already exists. Please use another." });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authdata = jwt.sign(data, JWT_ST);
      // console.log({ authdata });
      return res.status(201).json({ authdata });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server Error" });
    }
  }
);

// Route 2: Login User
router.post(
  "/loginUser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({ error: "Invalid email or password." });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid email or password." });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authdata = jwt.sign(data, JWT_ST);
      success = true;
      // console.log(success, authdata);

      return res.status(200).json({ authdata });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server Error" });
    }
  }
);

// Route 3 : Get logged-in user details using : POST "api/auth/getUserInfo"
router.post("/getUserInfo", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user without the password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
});
// Route 4 : Change User PAssword : POST "api/auth/changePassword"
// Route 4: Change Password
router.post(
  "/changePassword",
  [
    body("currentPassword", "Current password is required").exists(),
    body("newPassword", "New password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  fetchUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      user.password = hashedNewPassword;

      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

/* ✅ Route 5: Send OTP to email - POST /api/auth/send-otp
   Used to initiate password reset by sending a 6-digit OTP */
router.post(
  "/send-otp",
  [body("email", "Enter a valid email").isEmail()],
  async (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ error: "User not found with this email" });
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Delete any previous OTP for this email
      await OTP.deleteMany({ email });

      // Save OTP to DB
      await OTP.create({ email, otp: otpCode, expiresAt: otpExpiry });
// Debug: Check if environment variables are loaded
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? 'Loaded ✅' : 'Missing ❌');

      // Send Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // ✅ must not be empty
          pass: process.env.EMAIL_PASS, // ✅ must not be empty
        },
      });

      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code for password reset is ${otpCode}. It is valid for 10 minutes.`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  }
);

/* ✅ Route 6: Verify OTP - POST /api/auth/verify-otp
   Used to verify if the provided OTP is correct */
router.post(
  "/verify-otp",
  [
    body("email", "Enter a valid email").isEmail(),
    body("otp", "Enter the 6-digit OTP").isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const { email, otp } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const otpEntry = await OTP.findOne({ email, otp });
      if (!otpEntry) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      if (otpEntry.expiresAt < Date.now()) {
        await OTP.deleteMany({ email }); // Clean up expired
        return res.status(400).json({ error: "OTP has expired" });
      }

      res.status(200).json({ success: true, message: "OTP verified" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

/* ✅ Route 7: Reset Password - POST /api/auth/reset-password
   Used after OTP is verified to update the password */
router.post(
  "/reset-password",
  [
    body("email", "Enter a valid email").isEmail(),
    body("otp", "Enter the 6-digit OTP").isLength({ min: 6, max: 6 }),
    body("newPassword", "New password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const otpEntry = await OTP.findOne({ email, otp });
      if (!otpEntry) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      if (otpEntry.expiresAt < Date.now()) {
        await OTP.deleteMany({ email });
        return res.status(400).json({ error: "OTP has expired" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });

      // Delete OTP after successful reset
      await OTP.deleteMany({ email });

      res
        .status(200)
        .json({ success: true, message: "Password reset successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to reset password" });
    }
  }
);
module.exports = router;
