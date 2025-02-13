// Import jsPDF
const { jsPDF } = window.jspdf;

document.getElementById("invoiceForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const totalAmount = document.getElementById("totalAmount").value;
    const dueDate = document.getElementById("dueDate").value;

    // Submit data to the backend
    const response = await fetch("http://localhost:5000/api/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, totalAmount, dueDate }), 
    });

    const data = await response.json();
    if (data.message === "Invoice created and PDF generated successfully!") {
        alert("Invoice created!");
        generateInvoicePDF(customerName, totalAmount, dueDate);
        loadInvoices();
    } else {
        alert("Failed to create invoice.");
        console.error(data.error);
    }
});

// Generate PDF Invoice
function generateInvoicePDF(customerName, totalAmount, dueDate) {
    const doc = new jsPDF();
    doc.text("Invoice", 10, 10);
    doc.text(`Customer Name: ${customerName}`, 10, 20);
    doc.text(`Total Amount: $${totalAmount}`, 10, 30);
    doc.text(`Due Date: ${dueDate}`, 10, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 50);
    doc.save(`Invoice_${customerName}.pdf`);
}

// Load invoices
async function loadInvoices() {
    const response = await fetch("http://localhost:5000/api/invoices");
    const invoices = await response.json();
    document.getElementById("invoiceList").innerHTML = invoices
        .map(inv => `<p>${inv.customerName} - $${inv.totalAmount} - Status: ${inv.status}</p>`)
        .join("");
}

// Send payment reminders
async function sendReminders() {
    const response = await fetch("http://localhost:5000/api/invoices/send-reminders", {
        method: "POST"
    });
    const result = await response.json();
    alert(result.message);
}

// Load invoices on page load
loadInvoices();
