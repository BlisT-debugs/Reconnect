const express = require('express');
const router = express.Router();
const { 
    getDepartments, createDepartment, deleteDepartment,
    getPassingYears, createPassingYear, deletePassingYear 
} = require('../controllers/masterDataController');
const { protect, admin } = require('../middleware/authMiddleware');

// Departments
router.route('/departments')
    .get(protect, getDepartments)
    .post(protect, admin, createDepartment);
router.delete('/departments/:id', protect, admin, deleteDepartment);

// Passing Years
router.route('/years')
    .get(protect, getPassingYears)
    .post(protect, admin, createPassingYear);
router.delete('/years/:id', protect, admin, deletePassingYear);

module.exports = router;