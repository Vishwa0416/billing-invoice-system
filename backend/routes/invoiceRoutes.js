const express = require("express");
const Invoice = require("../models/Invoice");

const jsPDF = require("jspdf").jsPDF;


const router = express.Router();



/**
 * @route POST /api/invoices/create
 * @desc Create a new invoice and generate a PDF
 */

router.post("/create", async (req, res) => {
  try {
    const { customerName, email, totalAmount, dueDate, status } = req.body;

    // Validate inputs
    if (!customerName || !email || !totalAmount || !dueDate || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate status
    const validStatuses = ["Unpaid", "Paid"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Save invoice to DB
    const newInvoice = new Invoice({ customerName, email, totalAmount, dueDate, status });
    await newInvoice.save();

    // Generate PDF
    const doc = new jsPDF();
    doc.text("Invoice", 10, 10);
    doc.text(`Customer: ${customerName}`, 10, 20);
    doc.text(`Email: ${email}`, 10, 30);
    doc.text(`Total Amount: $${totalAmount}`, 10, 40);
    doc.text(`Due Date: ${dueDate}`, 10, 50);
    doc.text(`Status: ${status}`, 10, 60);  // Include status in PDF
    doc.text(`Created On: ${new Date().toLocaleDateString()}`, 10, 70);

    const pdfPath = `./public/invoices/invoice_${Date.now()}.pdf`;
    doc.save(pdfPath);

    res.status(201).json({
      message: "Invoice created and PDF generated successfully!",
      pdfPath
    });
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(500).json({ error: err.message });
  }
});



// Fetch all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate PDF for an invoice
router.get("/generate-pdf/:id", async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ error: "Invoice not found" });

  const doc = new jsPDF();
  doc.text(`Invoice for ${invoice.customerName}`, 20, 20);
  doc.text(`Total Amount: $${invoice.totalAmount}`, 20, 30);

  const pdfName = `invoice-${invoice._id}.pdf`;
  doc.save(pdfName);

  res.download(pdfName);
});



router.get("/overdue", async (req, res) => {
  try {
    const today = new Date();
    const overdueInvoices = await Invoice.find({
      dueDate: { $lt: today },
      status: "Unpaid"
    });
    res.status(200).json(overdueInvoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
