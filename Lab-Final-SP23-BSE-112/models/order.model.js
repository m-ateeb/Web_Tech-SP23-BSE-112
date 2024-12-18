const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  status: { type: String, default: 'Pending' }, // Order status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
