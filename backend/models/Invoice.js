const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true }, // ✅ Must be present
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  paymentDate: { type: Date }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
