const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, adminOnly, upload.array('images', 5), (req, res) => {
  try {
    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
