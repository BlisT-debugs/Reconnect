const prisma = require('../config/prisma');

// --- DEPARTMENTS ---
const getDepartments = async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            where: { tenantId: req.user.tenantId },
            orderBy: { name: 'asc' }
        });
        res.json(departments);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        const dept = await prisma.department.create({
            data: { tenantId: req.user.tenantId, name }
        });
        res.status(201).json(dept);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteDepartment = async (req, res) => {
    try {
        await prisma.department.deleteMany({
            where: { id: parseInt(req.params.id), tenantId: req.user.tenantId }
        });
        res.json({ message: 'Department removed' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// --- PASSING YEARS ---
const getPassingYears = async (req, res) => {
    try {
        const years = await prisma.passingYear.findMany({
            where: { tenantId: req.user.tenantId },
            orderBy: { year: 'desc' }
        });
        res.json(years);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createPassingYear = async (req, res) => {
    try {
        const { year } = req.body;
        const py = await prisma.passingYear.create({
            data: { tenantId: req.user.tenantId, year }
        });
        res.status(201).json(py);
    } catch (error) { res.status(500).json({ message: 'Year may already exist.' }); }
};

const deletePassingYear = async (req, res) => {
    try {
        await prisma.passingYear.deleteMany({
            where: { id: parseInt(req.params.id), tenantId: req.user.tenantId }
        });
        res.json({ message: 'Passing Year removed' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { 
    getDepartments, createDepartment, deleteDepartment,
    getPassingYears, createPassingYear, deletePassingYear 
};