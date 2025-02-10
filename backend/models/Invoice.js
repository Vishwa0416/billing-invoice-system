const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    customer: {type: String, required: true},
    items: [{product: String, quantity: Number, price: Number}],
    totalAmount:{type: Number, required: true},
    dueDate: {type: Date, required: true},
    status: {type: String, enum:['Paid','Pending'], default: 'Pending'}
});

module.exports = mongoose.model('Invoice',InvoiceSchema);