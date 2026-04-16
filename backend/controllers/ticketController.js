const prisma = require('../config/prisma');

// @desc    Get tickets (Admins see all, Users see their own)
const getTickets = async (req, res) => {
    try {
        const whereClause = { tenantId: req.user.tenantId };
        // If normal user, only show their tickets. Admins bypass this.
        if (req.user.role !== 'admin') {
            whereClause.userId = req.user.id;
        }

        const tickets = await prisma.ticket.findMany({
            where: whereClause,
            orderBy: { updatedAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                replies: {
                    include: { user: { select: { name: true, role: true } } },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        res.json(tickets);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Open a new support ticket
const createTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;
        
        const ticket = await prisma.ticket.create({
            data: {
                tenantId: req.user.tenantId,
                userId: req.user.id,
                subject,
                replies: {
                    create: [{ tenantId: req.user.tenantId, userId: req.user.id, message }]
                }
            }
        });
        res.status(201).json(ticket);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Add a reply to an existing ticket
const replyToTicket = async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id);
        const { message } = req.body;

        // 1. Add the reply
        const reply = await prisma.ticketReply.create({
            data: { tenantId: req.user.tenantId, ticketId, userId: req.user.id, message }
        });

        // 2. Automatically bump the ticket's "updatedAt" and set to in_progress if an admin replied
        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: req.user.role === 'admin' ? 'in_progress' : 'open' }
        });

        res.status(201).json(reply);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Close a ticket
const closeTicket = async (req, res) => {
    try {
        await prisma.ticket.update({
            where: { id: parseInt(req.params.id), tenantId: req.user.tenantId },
            data: { status: 'closed' }
        });
        res.json({ message: 'Ticket closed successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getTickets, createTicket, replyToTicket, closeTicket };