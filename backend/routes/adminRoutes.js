const express = require('express');
const router = express.Router();
const { getPendingUsers, approveUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Notice how we use BOTH protect (must be logged in) AND admin (must be an admin)
router.get('/pending', protect, admin, getPendingUsers);
router.post('/approve', protect, admin, approveUser);

module.exports = router;