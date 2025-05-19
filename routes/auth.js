const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashed });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("➡️ Attempting login for: ", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful for:", email);
    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
