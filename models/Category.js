const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

categorySchema.pre('insertMany', function (next, docs) {
  docs.forEach(doc => {
    if (!doc.slug && doc.name) {
      doc.slug = doc.name.toLowerCase().replace(/\s+/g, '-');
    }
  });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
