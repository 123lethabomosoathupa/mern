const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

exports.getMaintenanceRecords = async (req, res) => {
  try {
    const { status, type, vehicleId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (vehicleId) query.vehicle = vehicleId;

    const records = await Maintenance.find(query)
      .populate('vehicle', 'vehicleNumber make model')
      .populate('createdBy', 'name email')
      .sort('-scheduledDate');

    res.json(records);
  } catch (error) {
    console.error('Get maintenance records error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMaintenanceRecord = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id)
      .populate('vehicle', 'vehicleNumber make model mileage')
      .populate('createdBy', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Get maintenance record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createMaintenanceRecord = async (req, res) => {
  try {
    const recordData = {
      ...req.body,
      createdBy: req.user._id
    };

    const record = await Maintenance.create(recordData);

    if (record.status === 'in-progress') {
      await Vehicle.findByIdAndUpdate(record.vehicle, {
        status: 'maintenance'
      });
    }

    const populatedRecord = await Maintenance.findById(record._id)
      .populate('vehicle', 'vehicleNumber make model')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error('Create maintenance record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateMaintenanceRecord = async (req, res) => {
  try {
    const record = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vehicle', 'vehicleNumber make model')
     .populate('createdBy', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    if (record.status === 'completed') {
      await Vehicle.findByIdAndUpdate(record.vehicle, {
        status: 'available',
        lastMaintenanceDate: record.completedDate || Date.now(),
        nextMaintenanceDate: record.nextServiceMileage 
          ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          : null
      });
    } else if (record.status === 'in-progress') {
      await Vehicle.findByIdAndUpdate(record.vehicle, {
        status: 'maintenance'
      });
    }

    res.json(record);
  } catch (error) {
    console.error('Update maintenance record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteMaintenanceRecord = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    await record.deleteOne();
    res.json({ message: 'Maintenance record removed' });
  } catch (error) {
    console.error('Delete maintenance record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};