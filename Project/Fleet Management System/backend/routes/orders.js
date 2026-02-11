const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  assignOrder,
  deleteOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getOrders)
  .post(protect, authorize('admin', 'dispatcher'), createOrder);

router.route('/:id')
  .get(protect, getOrder)
  .put(protect, updateOrder)
  .delete(protect, authorize('admin'), deleteOrder);

router.put('/:id/assign', protect, authorize('admin', 'dispatcher'), assignOrder);

module.exports = router;