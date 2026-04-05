const prisma = require('../config/prisma');

// @desc    Get current user's alumni profile
// @route   GET /api/alumni/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const profile = await prisma.alumnus.findUnique({
            where: { userId: req.user.id },
            include: {
                batch: true,         // Automatically fetches the batch name!
                department: true,    // Automatically fetches the department name!
                passingYear: true
            }
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not created yet' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create or Update alumni profile
// @route   POST /api/alumni/profile
// @access  Private
const upsertProfile = async (req, res) => {
    try {
        // Extract all the fields from the request body
        const {
            first_name, last_name, official_email, nickname, phone, dob,
            blood_group, gender, about_me, company, designation,
            facebook_url, twitter_url, linkedin_url, instagram_url, github_url,
            state, city, zip, address,
            batchId, departmentId, passingYearId
        } = req.body;

        // Basic validation
        if (!first_name || !last_name) {
            return res.status(400).json({ message: 'First name and Last name are required' });
        }

        // Map the data safely
        const profileData = {
            tenantId: req.user.tenantId, // Locked to their specific college
            first_name, last_name, official_email, nickname, phone, 
            dob: dob ? new Date(dob) : null, // Convert string to Date object
            blood_group, gender, about_me, company, designation,
            facebook_url, twitter_url, linkedin_url, instagram_url, github_url,
            state, city, zip, address,
            batchId: batchId ? parseInt(batchId) : null,
            departmentId: departmentId ? parseInt(departmentId) : null,
            passingYearId: passingYearId ? parseInt(passingYearId) : null,
        };

        // UPSERT: If profile exists for this user, update it. If not, create it.
        const profile = await prisma.alumnus.upsert({
            where: { userId: req.user.id },
            update: profileData,
            create: {
                ...profileData,
                userId: req.user.id
            }
        });

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, upsertProfile };