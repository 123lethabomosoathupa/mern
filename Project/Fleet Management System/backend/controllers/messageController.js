const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const { type, isRead } = req.query;
    let query = {
      $or: [
        { recipient: req.user._id },
        { recipientRole: req.user.role },
        { recipientRole: 'all' }
      ]
    };

    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const messages = await Message.find(query)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .populate('relatedOrder', 'orderNumber status')
      .sort('-createdAt');

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ],
      type: 'direct'
    })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort('createdAt');

    res.json(messages);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      sender: req.user._id
    };

    const message = await Message.create(messageData);
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .populate('relatedOrder', 'orderNumber status');

    if (message.recipient) {
      req.app.get('io').to(message.recipient.toString()).emit('newMessage', populatedMessage);
    } else if (message.recipientRole) {
      req.app.get('io').emit('newBroadcast', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: Date.now() },
      { new: true }
    ).populate('sender', 'name email role');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.deleteOne();
    res.json({ message: 'Message removed' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};