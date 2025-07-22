const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

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
      console.log({ authdata });
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
      console.log(success, authdata);

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

module.exports = router;
