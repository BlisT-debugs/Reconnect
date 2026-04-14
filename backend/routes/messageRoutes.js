const express = require('express');
const router = express.Router();
const { getContacts, getChatHistory, saveMessage, getUnreadCounts, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/contacts', protect, getContacts);
router.get('/unread', protect, getUnreadCounts); 

router.put('/mark-read/:senderId', protect, markAsRead); 
router.get('/:otherUserId', protect, getChatHistory);
router.post('/', protect, saveMessage);

module.exports = router;