const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getJobs, createJob, updateJob } = require('../controllers/jobController');

router.route('/')
    .get(protect, getJobs)
    .post(protect, createJob);
router.route('/:id').put(protect, updateJob);

module.exports = router;