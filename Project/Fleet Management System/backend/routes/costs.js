const express = require('express');
const router = express.Router();
const {
  getCosts,
  getCost,
  createCost,
  updateCost,
  deleteCost
} = require('../controllers/costController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getCosts)
  .post(protect, createCost);

router.route('/:id')
  .get(protect, getCost)
  .put(protect, updateCost)
  .delete(protect, authorize('admin'), deleteCost);

module.exports = router;
