const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { category, search, featured, limit = 20, page = 1 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, price, cancelPrice, sizes, colors, description, category, stock, featured, tags, specifications, sizeChart } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : (specifications || []);
    const parsedSizeChart = typeof sizeChart === 'string' ? JSON.parse(sizeChart) : (sizeChart || []);

    const product = await Product.create({
      title,
      images,
      price: parseFloat(price),
      cancelPrice: cancelPrice ? parseFloat(cancelPrice) : null,
      sizes: parsedSizes || [],
      colors: parsedColors || [],
      description,
      category,
      stock: parseInt(stock) || 0,
      featured: featured === 'true' || featured === true,
      tags: parsedTags || [],
      specifications: parsedSpecs.filter(s => s.label && s.value),
      sizeChart: parsedSizeChart.filter(r => r.size && Array.isArray(r.measurements) && r.measurements.length > 0)
    });

    const populated = await product.populate('category', 'name slug');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, price, cancelPrice, sizes, colors, description, category, stock, featured, tags, existingImages, specifications, sizeChart } = req.body;

    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const oldImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : (existingImages || []);
    const images = [...oldImages, ...newImages];

    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : (specifications || []);
    const parsedSizeChart = typeof sizeChart === 'string' ? JSON.parse(sizeChart) : (sizeChart || []);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        images,
        price: parseFloat(price),
        cancelPrice: cancelPrice ? parseFloat(cancelPrice) : null,
        sizes: parsedSizes || [],
        colors: parsedColors || [],
        description,
        category,
        stock: parseInt(stock) || 0,
        featured: featured === 'true' || featured === true,
        tags: parsedTags || [],
        specifications: parsedSpecs.filter(s => s.label && s.value),
        sizeChart: parsedSizeChart.filter(r => r.size && Array.isArray(r.measurements) && r.measurements.length > 0)
      },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).populate('category', 'name slug').limit(4);

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const Product = require('../models/Product');
    const Category = require('../models/Category');
    const Order = require('../models/Order');

    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const revenue = revenueData[0]?.total || 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.product', 'title');

    res.json({ totalProducts, totalCategories, totalOrders, revenue, recentOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getRelatedProducts, getDashboardStats };
