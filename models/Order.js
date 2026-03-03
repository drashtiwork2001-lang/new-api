const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: String,
  image: String,
  price: Number,
  size: String,
  color: String,
  quantity: {
    type: Number,
    default: 1
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestEmail: String,
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
