const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  type: {
    type: String,
    enum: ['fuel', 'maintenance', 'insurance', 'tax', 'toll', 'parking', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  unitPrice: {
    type: Number
  },
  vendor: {
    name: String,
    phone: String
  },
  receiptNumber: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank-transfer', 'other'],
    default: 'cash'
  },
  mileageAtCost: {
    type: Number
  },
  notes: {
    type: String,
    trim: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cost', costSchema);