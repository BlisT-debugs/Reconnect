const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/alumniController');
const { protect } = require('../middleware/authMiddleware');

// Both routes require the user to be logged in
router.get('/profile', protect, getProfile);
router.post('/profile', protect, upsertProfile);

module.exports = router;