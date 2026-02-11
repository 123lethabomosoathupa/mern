const Order = require('../models/Order');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

exports.getOrders = async (req, res) => {
  try {
    const { status, priority } = req.query;
    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (req.user.role === 'driver') {
      const driver = await Driver.findOne({ user: req.user._id });
      if (driver) {
        query.assignedDriver = driver._id;
      }
    }

    const orders = await Order.find(query)
      .populate('assignedVehicle', 'vehicleNumber make model')
      .populate({
        path: 'assignedDriver',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('assignedVehicle', 'vehicleNumber make model currentLocation')
      .populate({
        path: 'assignedDriver',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('createdBy', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      orderNumber: `ORD${Date.now()}`,
      createdBy: req.user._id
    };

    const order = await Order.create(orderData);
    const populatedOrder = await Order.findById(order._id)
      .populate('assignedVehicle', 'vehicleNumber make model')
      .populate({
        path: 'assignedDriver',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      });

    req.app.get('io').emit('newOrder', populatedOrder);

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedVehicle', 'vehicleNumber make model')
     .populate({
       path: 'assignedDriver',
       populate: {
         path: 'user',
         select: 'name email phone'
       }
     });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    req.app.get('io').emit('orderUpdate', order);

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.assignOrder = async (req, res) => {
  try {
    const { vehicleId, driverId } = req.body;

    await Vehicle.findByIdAndUpdate(vehicleId, { 
      status: 'in-use',
      assignedDriver: driverId 
    });

    await Driver.findByIdAndUpdate(driverId, { 
      status: 'on-duty',
      currentVehicle: vehicleId 
    });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        assignedVehicle: vehicleId,
        assignedDriver: driverId,
        status: 'assigned'
      },
      { new: true }
    ).populate('assignedVehicle', 'vehicleNumber make model')
     .populate({
       path: 'assignedDriver',
       populate: {
         path: 'user',
         select: 'name email phone'
       }
     });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    req.app.get('io').emit('orderAssigned', order);

    res.json(order);
  } catch (error) {
    console.error('Assign order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};