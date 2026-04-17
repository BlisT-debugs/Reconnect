const express = require('express');
const router = express.Router();
const { getPlans, getMyMembership, purchaseMembership, setupTestPlans } = require('../controllers/membershipController');
const { protect } = require('../middleware/authMiddleware');

router.get('/plans', protect, getPlans);
router.get('/my', protect, getMyMembership);
router.post('/purchase', protect, purchaseMembership);
router.post('/setup-test', protect, setupTestPlans); // Dev only

module.exports = router;