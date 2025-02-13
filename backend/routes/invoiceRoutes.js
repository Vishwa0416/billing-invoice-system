const express = require("express");
const Invoice = require("../models/Invoice");
const jsPDF = require("jspdf");
const router = express.Router();

// Create an invoice
router.post("/create", async (req, res) => {
  try {
    const { customerName, totalAmount } = req.body;

    // Save to DB
    const newInvoice = new Invoice({ customerName, totalAmount });
    await newInvoice.save();

    // Generate PDF
    const doc = new jsPDF();
    doc.text("Invoice", 10, 10);
    doc.text(`Customer: ${customerName}`, 10, 20);
    doc.text(`Total Amount: $${totalAmount}`, 10, 30);
    const pdfPath = `./public/invoices/invoice_${Date.now()}.pdf`;
    doc.save(pdfPath);

    res.status(201).json({
      message: "Invoice created and PDF generated successfully!",
      pdfPath
    });
  } catch (err) {
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

module.exports = router;
