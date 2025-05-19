const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Models
const Expense = require("./models/Expense");

// Middleware
const auth = require("./middleware/auth");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// Mailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Use external routes
app.use("/auth", require("./routes/auth"));

// ✅ Forgot Password
app.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  const jwt = require("jsonwebtoken");
  const User = require("./models/User");

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"TrackIt" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.error("❌ Forgot password error:", err.message);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ✅ Expenses
app.get("/expenses", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

app.post("/expenses", auth, async (req, res) => {
  const { title, amount, category, date } = req.body;
  if (!title || !amount || !category || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newExpense = new Expense({
      user: req.user.id,
      title,
      amount,
      category,
      date,
    });

    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

app.put("/expenses/:id", auth, async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Unauthorized or not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

app.delete("/expenses/:id", auth, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: "Unauthorized or not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
