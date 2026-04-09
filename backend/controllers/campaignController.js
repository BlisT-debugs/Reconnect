const prisma = require('../config/prisma');

// @desc    Get all active campaigns
const getCampaigns = async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            where: { tenantId: req.user.tenantId, status: 1 },
            include: { 
                category: true,
                organizer: { select: { name: true, email: true } },
                donations: { select: { amount: true, createdAt: true, donor: { select: { name: true } } } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(campaigns);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Create a new campaign
const createCampaign = async (req, res) => {
    try {
        const { title, description, categoryName, target_amount, deadline, image } = req.body;

        // Auto-create category if it doesn't exist
        let category = await prisma.campaignCategory.findFirst({ where: { name: categoryName, tenantId: req.user.tenantId } });
        if (!category) category = await prisma.campaignCategory.create({ data: { name: categoryName, tenantId: req.user.tenantId } });

        const campaign = await prisma.campaign.create({
            data: {
                tenantId: req.user.tenantId,
                userId: req.user.id,
                categoryId: category.id,
                title, description, image,
                target_amount: parseFloat(target_amount),
                deadline: new Date(deadline)
            }
        });
        res.status(201).json(campaign);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Process a donation (Updates Campaign total dynamically)
const processDonation = async (req, res) => {
    try {
        const { campaignId, amount } = req.body;
        const donationAmount = parseFloat(amount);

        // We use a Prisma Transaction to ensure the Donation is recorded AND the Campaign total is updated safely
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the Donation Record
            const donation = await tx.donation.create({
                data: {
                    tenantId: req.user.tenantId,
                    campaignId: parseInt(campaignId),
                    userId: req.user.id,
                    amount: donationAmount
                }
            });

            // 2. Increment the raised_amount on the Campaign
            const updatedCampaign = await tx.campaign.update({
                where: { id: parseInt(campaignId) },
                data: { raised_amount: { increment: donationAmount } }
            });

            return { donation, updatedCampaign };
        });

        res.status(200).json({ message: 'Donation successful', data: result });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getCampaigns, createCampaign, processDonation };