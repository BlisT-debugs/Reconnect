const prisma = require('../config/prisma');

// @desc    Get all active events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: { tenantId: req.user.tenantId, status: 1 },
            orderBy: { date: 'asc' } // Show upcoming events first
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, banner_image } = req.body;

        if (!title || !description || !date || !location) {
            return res.status(400).json({ message: 'Title, Description, Date, and Location are required' });
        }

        const event = await prisma.event.create({
            data: {
                tenantId: req.user.tenantId,
                title,
                description,
                date: new Date(date),
                location,
                banner_image
            }
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an existing event
// @route   PUT /api/events/:id
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, banner_image } = req.body;

        const updateData = { title, description, date: new Date(date), location };
        if (banner_image) updateData.banner_image = banner_image; // Only update image if a new one was uploaded

        await prisma.event.updateMany({
            where: { id: parseInt(id), tenantId: req.user.tenantId },
            data: updateData
        });
        res.json({ message: 'Event updated successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getEvents, createEvent, updateEvent };