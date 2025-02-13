const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { sendEmail } = require("./utils/emailService");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


// Scheduled Task: Run every minute
cron.schedule("0 8 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueInvoices = await Invoice.find({ dueDate: { $lte: today }, status: "Unpaid" });
    if (dueInvoices.length === 0) {
      console.log("✅ No invoices due.");
      return;
    }

    for (const invoice of dueInvoices) {
      console.log(`Checking invoice for customer: ${invoice.customerName}`);
      console.log(`Invoice email: ${invoice.email}`);

      if (!invoice.email) {
        console.log(`❌ No email found for customer: ${invoice.customerName}`);
        continue;  // Skip this invoice if no email is provided
      }

      const message = `
      Dear ${invoice.customerName},

      This is a friendly reminder that your invoice of $${invoice.totalAmount} is due today (${invoice.dueDate.toDateString()}).

      Please make the payment at your earliest convenience to avoid penalties.

      Thank you,
      Billing & Invoice System
      `;

      await sendEmail(invoice.email, "Payment Reminder: Invoice Due Today", message);
      console.log(`📧 Reminder sent to: ${invoice.email}`);
    }
  } catch (error) {
    console.error("❌ Error in reminder task:", error.message);
  }
});



app.get("/", (req, res) => {
  res.send("Welcome to the Billing & Invoice System API!");
});

const invoiceRoutes = require("./routes/invoiceRoutes");
const Invoice = require("./models/Invoice");
app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
