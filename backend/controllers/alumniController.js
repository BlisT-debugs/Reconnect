const prisma = require('../config/prisma');

const getProfile = async (req, res) => {
    try {
        const profile = await prisma.alumnus.findUnique({
            where: { userId: req.user.id },
            include: {
                batch: true,         
                department: true,    
                passingYear: true
            }
        });

        if (!profile) return res.status(404).json({ message: 'Profile not created yet' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const upsertProfile = async (req, res) => {
    try {
        // 1. ADDED profile_pic! We also changed the academic fields to text strings.
        const {
            first_name, last_name, official_email, nickname, phone, dob,
            blood_group, gender, about_me, company, designation,
            facebook_url, twitter_url, linkedin_url, instagram_url, github_url,
            state, city, zip, address, profile_pic, 
            batch, department, passing_year 
        } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({ message: 'First name and Last name are required' });
        }

        // 2. MAGIC ACADEMIC LINKING: If user typed a Department String, find or create its ID!
        let departmentIdToSave = null;
        if (department) {
            let existingDept = await prisma.department.findFirst({ where: { name: department, tenantId: req.user.tenantId } });
            if (!existingDept) existingDept = await prisma.department.create({ data: { name: department, tenantId: req.user.tenantId } });
            departmentIdToSave = existingDept.id;
        }

        let batchIdToSave = null;
        if (batch) {
            let existingBatch = await prisma.batch.findFirst({ where: { name: batch, tenantId: req.user.tenantId } });
            if (!existingBatch) existingBatch = await prisma.batch.create({ data: { name: batch, tenantId: req.user.tenantId } });
            batchIdToSave = existingBatch.id;
        }

        let passingYearIdToSave = null;
        if (passing_year) {
            let existingYear = await prisma.passingYear.findFirst({ where: { name: passing_year, tenantId: req.user.tenantId } });
            if (!existingYear) existingYear = await prisma.passingYear.create({ data: { name: passing_year, tenantId: req.user.tenantId } });
            passingYearIdToSave = existingYear.id;
        }

        // 3. Map the data safely
        const profileData = {
            tenantId: req.user.tenantId, 
            first_name, last_name, official_email, nickname, phone, 
            dob: dob ? new Date(dob) : null,
            blood_group, gender, about_me, company, designation,
            facebook_url, twitter_url, linkedin_url, instagram_url, github_url,
            state, city, zip, address, 
            profile_pic, // <-- Now it will actually save to PostgreSQL!
            batchId: batchIdToSave,
            departmentId: departmentIdToSave,
            passingYearId: passingYearIdToSave,
        };

        const profile = await prisma.alumnus.upsert({
            where: { userId: req.user.id },
            update: profileData,
            create: { ...profileData, userId: req.user.id }
        });

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, upsertProfile };