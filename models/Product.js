const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  images: [{
    type: String
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  cancelPrice: {
    type: Number,
    default: null
  },
  sizes: [{
    type: String,
    trim: true
  }],
  colors: [{
    name: String,
    hex: String
  }],
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  specifications: [{
    label: { type: String },
    value: { type: String }
  }],
  sizeChart: [{
    size: { type: String },
    measurements: [{
      label: { type: String },
      value: { type: String }
    }]
  }]
}, { timestamps: true });

productSchema.virtual('discountPercent').get(function () {
  if (this.cancelPrice && this.cancelPrice > this.price) {
    return Math.round(((this.cancelPrice - this.price) / this.cancelPrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
