const express = require('express');
const router = express.Router();
const { getNews, createNews, getNotices, createNotice } = require('../controllers/newsNoticeController');
const { protect } = require('../middleware/authMiddleware');

// News Routes
router.route('/news').get(protect, getNews).post(protect, createNews);

// Notice Routes
router.route('/notices').get(protect, getNotices).post(protect, createNotice);

module.exports = router;    