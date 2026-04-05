const prisma = require('../config/prisma');

// @desc    Get all active jobs for the current tenant
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            where: { 
                tenantId: req.user.tenantId,
                status: 1 // Only show active jobs
            },
            orderBy: { createdAt: 'desc' }, // Newest jobs first
            include: {
                postedBy: { select: { name: true, email: true } } // Show who posted it
            }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    try {
        const { title, company, location, description, salary_range, experience_required, apply_link, deadline } = req.body;

        if (!title || !company || !description) {
            return res.status(400).json({ message: 'Title, Company, and Description are required' });
        }

        const job = await prisma.job.create({
            data: {
                tenantId: req.user.tenantId,
                userId: req.user.id, // Automatically linked to the logged-in user!
                title,
                company,
                location,
                description,
                salary_range,
                experience_required,
                apply_link,
                deadline: deadline ? new Date(deadline) : null,
            }
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getJobs, createJob };