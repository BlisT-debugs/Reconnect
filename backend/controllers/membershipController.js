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
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe Checkout Session
// @route   POST /api/memberships/create-checkout-session
const createCheckoutSession = async (req, res) => {
    try {
        const { planId } = req.body;
        const tenantId = req.user.tenantId;
        const userId = req.user.id;

        // 1. Fetch Plan securely from DB
        const plan = await prisma.membershipPlan.findUnique({ where: { id: parseInt(planId) } });
        if (!plan) return res.status(404).json({ message: "Plan not found" });

        // If the plan is Free, activate it instantly without Stripe
        if (plan.price === 0) {
            // ... (You can paste the old atomic transaction logic here for free plans)
            return res.status(200).json({ message: "Free plan activated", free: true });
        }

        // 2. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${plan.title} Membership`,
                            description: plan.description,
                        },
                        unit_amount: Math.round(plan.price * 100), // Stripe expects cents!
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/membership?success=true`,
            cancel_url: `http://localhost:5173/membership?canceled=true`,
            // CRITICAL: We pass our internal DB IDs to Stripe so the Webhook knows who paid!
            metadata: {
                userId: userId.toString(),
                tenantId: tenantId,
                planId: plan.id.toString(),
                duration: plan.duration.toString()
            }
        });

        // 3. Return the Stripe URL to the frontend
        res.status(200).json({ url: session.url });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
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

module.exports = { getPlans, getMyMembership, createCheckoutSession, setupTestPlans };
