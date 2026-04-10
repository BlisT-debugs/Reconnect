const express = require('express');
const router = express.Router();
const { getNews, createNews, updateNews, getNotices, createNotice, updateNotice } = require('../controllers/newsNoticeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/news').get(protect, getNews).post(protect, createNews);
router.route('/news/:id').put(protect, updateNews);
router.route('/notices').get(protect, getNotices).post(protect, createNotice);
router.route('/notices/:id').put(protect, updateNotice);

module.exports = router;    