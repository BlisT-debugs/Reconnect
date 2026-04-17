const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../config/prisma');

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the webhook is actually from Stripe using the raw body and your webhook secret
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Extract the metadata we passed in Step 2
        const userId = parseInt(session.metadata.userId);
        const tenantId = session.metadata.tenantId;
        const planId = parseInt(session.metadata.planId);
        const duration = parseInt(session.metadata.duration);

        // Calculate Expiry Date
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        try {
            // Execute Atomic Financial Transaction (Just like before!)
            await prisma.$transaction(async (tx) => {
                await tx.transaction.create({
                    data: {
                        tenantId, userId,
                        amount: session.amount_total / 100, // Convert cents back to dollars
                        type: 'membership',
                        reference: session.payment_intent // Save real Stripe Transaction ID
                    }
                });

                await tx.userMembership.updateMany({
                    where: { userId, tenantId, status: 'active' },
                    data: { status: 'expired' }
                });

                await tx.userMembership.create({
                    data: { tenantId, userId, planId, startDate, endDate, status: 'active' }
                });
            });

            console.log(`Payment successful & Membership activated for User ${userId}`);
        } catch (dbError) {
            console.error("Database fulfillment failed:", dbError);
        }
    }

    res.status(200).send('Webhook Received');
};

module.exports = { handleStripeWebhook };