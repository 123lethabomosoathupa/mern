const Driver = require('../models/Driver');
const User = require('../models/User');

exports.getDrivers = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = status;

    const drivers = await Driver.find(query)
      .populate('user', 'name email phone isActive')
      .populate('currentVehicle', 'vehicleNumber make model')
      .sort('-createdAt');

    res.json(drivers);
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('user', 'name email phone isActive')
      .populate('currentVehicle', 'vehicleNumber make model status');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDriverByUserId = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.params.userId })
      .populate('user', 'name email phone isActive')
      .populate('currentVehicle', 'vehicleNumber make model status');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Get driver by user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    const populatedDriver = await Driver.findById(driver._id)
      .populate('user', 'name email phone');

    res.status(201).json(populatedDriver);
  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')
     .populate('currentVehicle', 'vehicleNumber make model');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDriverLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const driver = await Driver.findByIdAndUpdate(
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

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    req.app.get('io').emit('driverLocationUpdate', {
      driverId: driver._id,
      location: driver.currentLocation
    });

    res.json(driver);
  } catch (error) {
    console.error('Update driver location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    await driver.deleteOne();
    res.json({ message: 'Driver removed' });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};