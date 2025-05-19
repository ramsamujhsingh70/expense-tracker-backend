const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // <-- If user is missing, 500 error will occur
  },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
