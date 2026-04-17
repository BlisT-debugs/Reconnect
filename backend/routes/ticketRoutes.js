const express = require('express');
const router = express.Router();
const { getTickets, createTicket, replyToTicket, closeTicket } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTickets).post(protect, createTicket);
router.post('/:id/reply', protect, replyToTicket);
router.put('/:id/close', protect, closeTicket);

module.exports = router;