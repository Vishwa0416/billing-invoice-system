const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
