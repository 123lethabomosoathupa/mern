const express = require('express');
const router = express.Router();
const {
  getMessages,
  getConversation,
  sendMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getMessages)
  .post(protect, sendMessage);

router.get('/conversation/:userId', protect, getConversation);

router.route('/:id')
  .delete(protect, deleteMessage);

router.put('/:id/read', protect, markAsRead);

module.exports = router;