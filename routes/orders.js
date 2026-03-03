const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', createOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
