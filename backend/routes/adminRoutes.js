const express = require('express');
const router = express.Router();
const { getPendingUsers, approveUser } = require('../controllers/adminController');
const { deleteEntity } = require('../controllers/adminModerationController'); 
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/pending', protect, admin, getPendingUsers);
router.post('/approve', protect, admin, approveUser);

router.delete('/moderate/:entityType/:id', protect, admin, deleteEntity);

module.exports = router;