const express = require('express');
const router = express.Router();
const {
  getDrivers,
  getDriver,
  getDriverByUserId,
  createDriver,
  updateDriver,
  updateDriverLocation,
  deleteDriver
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getDrivers)
  .post(protect, authorize('admin'), createDriver);

router.get('/user/:userId', protect, getDriverByUserId);

router.route('/:id')
  .get(protect, getDriver)
  .put(protect, authorize('admin', 'dispatcher'), updateDriver)
  .delete(protect, authorize('admin'), deleteDriver);

router.put('/:id/location', protect, updateDriverLocation);

module.exports = router;
