const express = require('express');
const router = express.Router();
const { getPlans, getMyMembership, createCheckoutSession, setupTestPlans } = require('../controllers/membershipController');
const { protect } = require('../middleware/authMiddleware');

router.get('/plans', protect, getPlans);
router.get('/my', protect, getMyMembership);
router.post('/purchase', protect, createCheckoutSession);
router.post('/setup-test', protect, setupTestPlans); // Dev only

module.exports = router;