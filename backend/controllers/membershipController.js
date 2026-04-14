const prisma = require('../config/prisma');

// @desc    Get all active membership plans
const getPlans = async (req, res) => {
    try {
        const plans = await prisma.membershipPlan.findMany({ where: { tenantId: req.user.tenantId, status: 1 } });
        res.json(plans);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get the current user's active membership
const getMyMembership = async (req, res) => {
    try {
        const membership = await prisma.userMembership.findFirst({
            where: { userId: req.user.id, tenantId: req.user.tenantId, status: 'active' },
            include: { plan: true },
            orderBy: { endDate: 'desc' }
        });
        res.json(membership || null);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Purchase a Membership (The Financial Transaction)
const purchaseMembership = async (req, res) => {
    try {
        const { planId } = req.body;
        const tenantId = req.user.tenantId;
        const userId = req.user.id;

        // 1. Fetch the requested plan to get price and duration securely from the DB
        const plan = await prisma.membershipPlan.findUnique({ where: { id: parseInt(planId) } });
        if (!plan) return res.status(404).json({ message: "Plan not found" });

        // Calculate Expiry Date based on duration
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + plan.duration);

        // 2. Execute Financial Transaction
        const result = await prisma.$transaction(async (tx) => {
            // A. Log the payment receipt
            const transaction = await tx.transaction.create({
                data: {
                    tenantId, userId,
                    amount: plan.price,
                    type: 'membership',
                    reference: `TXN-MEM-${Date.now()}` // Mock Gateway Reference
                }
            });

            // B. Deactivate any old memberships to prevent overlaps
            await tx.userMembership.updateMany({
                where: { userId, tenantId, status: 'active' },
                data: { status: 'expired' }
            });

            // C. Create the new Active Membership
            const membership = await tx.userMembership.create({
                data: { tenantId, userId, planId: plan.id, startDate, endDate, status: 'active' }
            });

            return { transaction, membership };
        });

        res.status(200).json({ message: "Membership activated successfully!", data: result });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    DEV UTILITY: Auto-generate starter plans
const setupTestPlans = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        await prisma.membershipPlan.createMany({
            data: [
                { tenantId, title: "Basic", description: "Standard Alumni Access", price: 0, duration: 365, features: "Directory Access, Job Board" },
                { tenantId, title: "Silver", description: "Enhanced Networking", price: 49.99, duration: 365, features: "Directory Access, Job Board, Direct Messaging" },
                { tenantId, title: "Premium", description: "Full VIP Access", price: 99.99, duration: 365, features: "Directory Access, Job Board, Direct Messaging, Voting Rights, Post Events" }
            ]
        });
        res.json({ message: "Test plans created!" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getPlans, getMyMembership, purchaseMembership, setupTestPlans };