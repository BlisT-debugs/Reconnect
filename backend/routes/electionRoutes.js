const express = require('express');
const router = express.Router();
const { getElections, castVote, setupTestElection, updateElection } = require('../controllers/electionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getElections);
router.put('/:id', protect, updateElection);
router.post('/vote', protect, castVote);
router.post('/setup-test', protect, setupTestElection); // Dev only

module.exports = router;