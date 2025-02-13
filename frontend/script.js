const { jsPDF } = window.jspdf;

document.getElementById("invoiceForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const email = document.getElementById("email").value;
    const totalAmount = document.getElementById("totalAmount").value;
    const dueDate = document.getElementById("dueDate").value;
    const status = document.getElementById("status").value; 

    // Validate email
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Submit data to the backend
    const response = await fetch("http://localhost:5000/api/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, email, totalAmount, dueDate , status }),
    });

    const data = await response.json();
    if (data.message) {
        alert(data.message);
        generateInvoicePDF(customerName, email, totalAmount, dueDate);
        loadInvoices();
    } else {
        alert("Failed to create invoice: " + data.error);
    }
});

// Generate PDF Invoice
function generateInvoicePDF(customerName, email, totalAmount, dueDate) {
    const doc = new jsPDF();
    doc.text("Invoice", 10, 10);
    doc.text(`Customer Name: ${customerName}`, 10, 20);
    doc.text(`Email: ${email}`, 10, 30);
    doc.text(`Total Amount: $${totalAmount}`, 10, 40);
    doc.text(`Due Date: ${dueDate}`, 10, 50);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 10, 60);
    doc.save(`Invoice_${customerName}.pdf`);
}

// Validate Email Address
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// Load existing invoices
async function loadInvoices() {
    const response = await fetch("http://localhost:5000/api/invoices");
    const invoices = await response.json();
    document.getElementById("invoiceList").innerHTML = invoices
        .map(inv => `<p>${inv.customerName} - ${inv.email} - $${inv.totalAmount} (Due: ${inv.dueDate})</p>`)
        .join("");
}

// Initial load
loadInvoices();
