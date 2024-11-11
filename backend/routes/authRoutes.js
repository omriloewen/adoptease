const express = require("express");
const { check } = require("express-validator");
const { signUp } = require("../controllers/authController");
const { login } = require("../controllers/authController");
const { generateResetToken } = require("../controllers/authController");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendResetEmail = require("../utils/email");

// Sign-up route
router.post(
  "/signup",
  [
    check("firstName", "first name is required").not().isEmpty(),
    check("lastName", "last name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  signUp
);

// Login route
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

router.post("/reset-password", async (req, res) => {
  const { token } = req.body;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).send("User not found");

    // Update password and save user
    user.password = newPassword; // Ensure password is hashed
    await user.save();

    res.status(200).send("Password has been reset successfully");
  } catch (error) {
    console.error("Invalid or expired token:", error);
    res.status(400).send("Invalid or expired token");
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).send("User not found");

  const token = generateResetToken(user); // Generate a secure token
  const resetLink = `http://localhost:3000/reset-password/${token}`;

  await sendResetEmail(email, resetLink);
  res.status(200).send("Reset link sent to email");
});

module.exports = router;
