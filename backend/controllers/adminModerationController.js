const prisma = require('../config/prisma');

// @desc    Master endpoint for Admin to delete ANY entity
// @route   DELETE /api/admin/moderate/:entityType/:id
// @access  Private/Admin
const deleteEntity = async (req, res) => {
    try {
        const { entityType, id } = req.params;
        const numericId = parseInt(id);
        const tenantId = req.user.tenantId;

        let result;

        // We use deleteMany so we can safely include the tenantId check in the WHERE clause.
        // It prevents cross-tenant deletion attacks.
        switch (entityType) {
            case 'job':
                result = await prisma.job.deleteMany({ where: { id: numericId, tenantId } });
                break;
            case 'event':
                result = await prisma.event.deleteMany({ where: { id: numericId, tenantId } });
                break;
            case 'news':
                result = await prisma.news.deleteMany({ where: { id: numericId, tenantId } });
                break;
            case 'notice':
                result = await prisma.notice.deleteMany({ where: { id: numericId, tenantId } });
                break;
            case 'campaign':
                result = await prisma.campaign.deleteMany({ where: { id: numericId, tenantId } });
                break;
            case 'election':
                result = await prisma.committeeElection.deleteMany({ where: { id: numericId, tenantId } });
                break;
            case 'candidate':
                result = await prisma.committeeCandidate.deleteMany({ where: { id: numericId, tenantId } });
                break;
            default:
                return res.status(400).json({ message: 'Invalid entity type provided to moderator engine.' });
        }

        // If count is 0, the record didn't exist or didn't belong to this tenant
        if (result.count === 0) {
            return res.status(404).json({ message: `${entityType} not found or access denied.` });
        }

        res.json({ message: `Admin successfully deleted the ${entityType}.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { deleteEntity };