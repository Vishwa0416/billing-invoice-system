// Import jsPDF
const { jsPDF } = window.jspdf;

document.getElementById("invoiceForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const totalAmount = document.getElementById("totalAmount").value;

    // Send data to backend
    const response = await fetch("http://localhost:5000/api/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, totalAmount }),
    });

    const data = await response.json();
    if (data.message === "Invoice created successfully!") {
        alert(data.message);
        generateInvoicePDF(customerName, totalAmount);
        loadInvoices();
    } else {
        alert("Failed to create invoice.");
    }
});

// Generate PDF Invoice
function generateInvoicePDF(customerName, totalAmount) {
    const doc = new jsPDF();
    doc.text("Invoice", 10, 10);
    doc.text(`Customer Name: ${customerName}`, 10, 20);
    doc.text(`Total Amount: $${totalAmount}`, 10, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 40);
    doc.save(`Invoice_${customerName}.pdf`);
}

// Load existing invoices
async function loadInvoices() {
    const response = await fetch("http://localhost:5000/api/invoices");
    const invoices = await response.json();
    document.getElementById("invoiceList").innerHTML = invoices
        .map(inv => `<p>${inv.customerName} - $${inv.totalAmount}</p>`)
        .join("");
}

loadInvoices();
