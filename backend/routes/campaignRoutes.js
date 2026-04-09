const express = require('express');
const router = express.Router();
const { getCampaigns, createCampaign, processDonation } = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCampaigns).post(protect, createCampaign);
router.post('/donate', protect, processDonation);

module.exports = router;