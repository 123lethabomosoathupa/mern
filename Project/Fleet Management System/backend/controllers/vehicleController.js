const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const vehicles = await Vehicle.find(query)
      .populate('assignedDriver', 'user licenseNumber status')
      .populate({
        path: 'assignedDriver',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .sort('-createdAt');

    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('assignedDriver', 'user licenseNumber status')
      .populate({
        path: 'assignedDriver',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateVehicleLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: Date.now()
        }
      },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    req.app.get('io').emit('vehicleLocationUpdate', {
      vehicleId: vehicle._id,
      location: vehicle.currentLocation
    });

    res.json(vehicle);
  } catch (error) {
    console.error('Update vehicle location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};