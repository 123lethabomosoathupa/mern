const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['truck', 'van', 'car', 'motorcycle'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  capacityUnit: {
    type: String,
    enum: ['kg', 'tons', 'cubic_meters'],
    default: 'kg'
  },
  status: {
    type: String,
    enum: ['available', 'in-use', 'maintenance', 'out-of-service'],
    default: 'available'
  },
  currentLocation: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    default: 'diesel'
  },
  fuelConsumption: {
    type: Number,
    default: 0
  },
  mileage: {
    type: Number,
    default: 0
  },
  lastMaintenanceDate: {
    type: Date
  },
  nextMaintenanceDate: {
    type: Date
  },
  insuranceExpiry: {
    type: Date
  },
  registrationExpiry: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);