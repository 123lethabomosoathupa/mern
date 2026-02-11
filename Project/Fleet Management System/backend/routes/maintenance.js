const express = require('express');
const router = express.Router();
const {
  getMaintenanceRecords,
  getMaintenanceRecord,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getMaintenanceRecords)
  .post(protect, authorize('admin', 'dispatcher'), createMaintenanceRecord);

router.route('/:id')
  .get(protect, getMaintenanceRecord)
  .put(protect, authorize('admin', 'dispatcher'), updateMaintenanceRecord)
  .delete(protect, authorize('admin'), deleteMaintenanceRecord);

module.exports = router;