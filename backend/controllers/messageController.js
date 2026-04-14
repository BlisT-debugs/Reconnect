const prisma = require('../config/prisma');

// @desc    Get all available contacts for chat
// @route   GET /api/messages/contacts
const getContacts = async (req, res) => {
    try {
        const contacts = await prisma.user.findMany({
            where: { 
                tenantId: req.user.tenantId, 
                status: 1, // Only active users
                id: { not: req.user.id } // Exclude the currently logged-in user
            },
            select: { id: true, name: true, role: true, email: true } // Only send safe data
        });
        res.json(contacts);
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

const getChatHistory = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user.id;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId, receiverId: parseInt(otherUserId) },
                    { senderId: parseInt(otherUserId), receiverId: currentUserId }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });
        res.json(messages);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const saveMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const message = await prisma.message.create({
            data: { senderId: req.user.id, receiverId: parseInt(receiverId), content }
        });
        res.status(201).json(message);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// ... existing getContacts, getChatHistory, saveMessage ...

// @desc    Get unread message counts grouped by sender
// @route   GET /api/messages/unread
const getUnreadCounts = async (req, res) => {
    try {
        // We use Prisma's groupBy to quickly count unread messages per user
        const unread = await prisma.message.groupBy({
            by: ['senderId'],
            where: { receiverId: req.user.id, isRead: false },
            _count: { id: true }
        });
        
        // Format it into a clean object: { "userId": count }
        const counts = {};
        unread.forEach(item => counts[item.senderId] = item._count.id);
        res.json(counts);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Mark all messages from a specific user as read
// @route   PUT /api/messages/mark-read/:senderId
const markAsRead = async (req, res) => {
    try {
        await prisma.message.updateMany({
            where: { 
                senderId: parseInt(req.params.senderId), 
                receiverId: req.user.id, 
                isRead: false 
            },
            data: { isRead: true }
        });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getContacts, getChatHistory, saveMessage, getUnreadCounts, markAsRead };