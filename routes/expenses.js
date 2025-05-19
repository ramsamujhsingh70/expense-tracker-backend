const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

// GET expenses only for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// POST new expense
// POST expense - CREATE new expense
router.post("/", auth, async (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !category || !date) {
    console.log("❌ Missing required fields:", req.body); // debug log
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    console.log("🧾 Incoming data:", req.body); // print form data
    console.log("👤 Authenticated User ID:", req.user.id); // ensure middleware is working

    const newExpense = new Expense({
      user: req.user.id,
      title,
      amount,
      category,
      date,
    });

    const saved = await newExpense.save();
    console.log("✅ Expense saved:", saved); // confirm success
    return res.status(201).json(saved);
  } catch (err) {
    console.error("🔥 Add Expense Failed:", err.message); // real error printed
    console.error("📜 Stack Trace:", err.stack); // show full trace
    return res.status(500).json({ error: "Failed to add expense" });
  }
});



// PUT (Update)
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!deleted) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
