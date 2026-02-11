const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  updateVehicleLocation,
  deleteVehicle
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getVehicles)
  .post(protect, authorize('admin', 'dispatcher'), createVehicle);

router.route('/:id')
  .get(protect, getVehicle)
  .put(protect, authorize('admin', 'dispatcher'), updateVehicle)
  .delete(protect, authorize('admin'), deleteVehicle);

router.put('/:id/location', protect, updateVehicleLocation);

module.exports = router;