const Cost = require('../models/Cost');

exports.getCosts = async (req, res) => {
  try {
    const { type, vehicleId, startDate, endDate } = req.query;
    let query = {};

    if (type) query.type = type;
    if (vehicleId) query.vehicle = vehicleId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const costs = await Cost.find(query)
      .populate('vehicle', 'vehicleNumber make model')
      .populate('recordedBy', 'name email')
      .sort('-date');

    res.json(costs);
  } catch (error) {
    console.error('Get costs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCost = async (req, res) => {
  try {
    const cost = await Cost.findById(req.params.id)
      .populate('vehicle', 'vehicleNumber make model mileage')
      .populate('recordedBy', 'name email');

    if (!cost) {
      return res.status(404).json({ message: 'Cost record not found' });
    }

    res.json(cost);
  } catch (error) {
    console.error('Get cost error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCost = async (req, res) => {
  try {
    const costData = {
      ...req.body,
      recordedBy: req.user._id
    };

    const cost = await Cost.create(costData);
    const populatedCost = await Cost.findById(cost._id)
      .populate('vehicle', 'vehicleNumber make model')
      .populate('recordedBy', 'name email');

    res.status(201).json(populatedCost);
  } catch (error) {
    console.error('Create cost error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCost = async (req, res) => {
  try {
    const cost = await Cost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vehicle', 'vehicleNumber make model')
     .populate('recordedBy', 'name email');

    if (!cost) {
      return res.status(404).json({ message: 'Cost record not found' });
    }

    res.json(cost);
  } catch (error) {
    console.error('Update cost error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCost = async (req, res) => {
  try {
    const cost = await Cost.findById(req.params.id);

    if (!cost) {
      return res.status(404).json({ message: 'Cost record not found' });
    }

    await cost.deleteOne();
    res.json({ message: 'Cost record removed' });
  } catch (error) {
    console.error('Delete cost error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};