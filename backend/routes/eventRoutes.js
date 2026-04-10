const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getEvents, createEvent, updateEvent } = require('../controllers/eventController');

router.route('/')
    .get(protect, getEvents)
    .post(protect, createEvent);
router.route('/:id').put(protect, updateEvent);

module.exports = router;