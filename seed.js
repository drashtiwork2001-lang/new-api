const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seed = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/premiumwear');
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@premiumwear.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('👤 Admin created: admin@premiumwear.com / admin123');

    const categories = await Category.insertMany([
      { name: 'Full Sleeve Shirt', slug: 'full-sleeve-shirt', description: 'Elegant full sleeve shirts for every occasion' },
      { name: 'Half Sleeve Shirt', slug: 'half-sleeve-shirt', description: 'Comfortable half sleeve shirts for casual wear' },
      { name: 'Premium Shirt', slug: 'premium-shirt', description: 'Luxury premium shirts crafted with finest fabrics' }
    ]);
    console.log('📂 Categories created');

    const [fullSleeve, halfSleeve, premium] = categories;

    const products = [
      {
        title: 'Classic Oxford Full Sleeve Shirt',
        images: [
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600',
          'https://images.unsplash.com/photo-1594938298603-c8148c4b4d51?w=600'
        ],
        price: 1299,
        cancelPrice: 2499,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Sky Blue', hex: '#87CEEB' },
          { name: 'Navy', hex: '#1B2A4A' }
        ],
        description: 'A timeless Oxford full sleeve shirt crafted from premium 100% cotton. Perfect for formal occasions and business meetings. Features a classic collar, button-down front, and a tailored fit that exudes sophistication.',
        category: fullSleeve._id,
        stock: 50,
        featured: true,
        tags: ['formal', 'oxford', 'cotton', 'classic']
      },
      {
        title: 'Linen Blend Full Sleeve Shirt',
        images: [
          'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600',
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600'
        ],
        price: 1599,
        cancelPrice: 2999,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Beige', hex: '#F5F0E8' },
          { name: 'Olive', hex: '#808000' },
          { name: 'White', hex: '#FFFFFF' }
        ],
        description: 'Premium linen blend full sleeve shirt that combines comfort with elegance. The breathable fabric makes it perfect for all-day wear. Features a relaxed fit with a subtle texture that adds depth to your look.',
        category: fullSleeve._id,
        stock: 35,
        featured: true,
        tags: ['linen', 'casual', 'breathable', 'summer']
      },
      {
        title: 'Casual Polo Half Sleeve Shirt',
        images: [
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
          'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600'
        ],
        price: 899,
        cancelPrice: 1699,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Navy', hex: '#1B2A4A' }
        ],
        description: 'A versatile casual polo half sleeve shirt made from premium pique cotton. The classic polo collar and clean lines make it perfect for both casual outings and smart-casual occasions.',
        category: halfSleeve._id,
        stock: 60,
        featured: false,
        tags: ['polo', 'casual', 'cotton', 'versatile']
      },
      {
        title: 'Striped Half Sleeve Summer Shirt',
        images: [
          'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'
        ],
        price: 799,
        cancelPrice: 1499,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Blue Stripe', hex: '#4A90D9' },
          { name: 'Red Stripe', hex: '#E74C3C' },
          { name: 'Green Stripe', hex: '#27AE60' }
        ],
        description: 'Fresh and vibrant striped half sleeve shirt perfect for summer. Made from lightweight cotton blend fabric that keeps you cool and comfortable. The classic stripe pattern adds a timeless touch to your casual wardrobe.',
        category: halfSleeve._id,
        stock: 45,
        featured: false,
        tags: ['striped', 'summer', 'casual', 'colorful']
      },
      {
        title: 'Luxury Silk-Touch Premium Shirt',
        images: [
          'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600',
          'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600'
        ],
        price: 2999,
        cancelPrice: 4999,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Champagne', hex: '#F7E7CE' },
          { name: 'Midnight Blue', hex: '#191970' },
          { name: 'Charcoal', hex: '#36454F' }
        ],
        description: 'Experience unparalleled luxury with our silk-touch premium shirt. Crafted from the finest micro-modal fabric, this shirt offers an incredibly soft feel against your skin. Perfect for special occasions, fine dining, and events where you want to make a lasting impression.',
        category: premium._id,
        stock: 20,
        featured: true,
        tags: ['luxury', 'silk', 'premium', 'formal', 'special occasion']
      },
      {
        title: 'Italian Cut Premium Dress Shirt',
        images: [
          'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600',
          'https://images.unsplash.com/photo-1594938298603-c8148c4b4d51?w=600'
        ],
        price: 3499,
        cancelPrice: 5999,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Pure White', hex: '#FAFAFA' },
          { name: 'Ice Blue', hex: '#D6EAF8' },
          { name: 'Blush Pink', hex: '#FADBD8' }
        ],
        description: 'An exquisite Italian-cut premium dress shirt that redefines elegance. Featuring mother-of-pearl buttons, French seams, and a slim-fit silhouette that flatters every body type. Made from Egyptian cotton with a 200-thread count for the ultimate in luxury and comfort.',
        category: premium._id,
        stock: 15,
        featured: true,
        tags: ['italian', 'dress shirt', 'luxury', 'egyptian cotton', 'slim fit']
      }
    ];

    await Product.insertMany(products);
    console.log('🛍️  6 Demo products created');

    console.log('\n✅ Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:');
    console.log('  Email:    admin@premiumwear.com');
    console.log('  Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
