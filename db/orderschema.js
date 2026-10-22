const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal: { type: String, required: true },
    notes: { type: String },
  },
  items: [
    {
      id: { type: String },
      name: { type: String, required: true },
      image: { type: String },
      size: { type: String },
      color: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  paymentMethod: { type: String, enum: ['cod', 'online'], required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  stripeSessionId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);