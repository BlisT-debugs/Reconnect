const express = require('express');
const router = express.Router();
const { getPosts, createPost, toggleLike, addComment } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPosts).post(protect, createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router;