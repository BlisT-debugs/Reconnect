const prisma = require('../config/prisma');

// @desc    Get all pending users
// @route   GET /api/admin/pending
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            // Assuming status 0 means "Pending"
            where: { tenantId: req.user.tenantId, status: 0 },
            select: { id: true, name: true, email: true, createdAt: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a specific user
// @route   POST /api/admin/approve
// @access  Private/Admin
const approveUser = async (req, res) => {
    try {
        const { userId } = req.body;
        
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { status: 1 } // 1 means "Approved"
        });
        
        res.json({ message: 'User approved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPendingUsers, approveUser };