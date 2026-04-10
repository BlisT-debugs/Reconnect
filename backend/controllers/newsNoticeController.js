const prisma = require('../config/prisma');

// --- NEWS LOGIC ---
const getNews = async (req, res) => {
    try {
        const news = await prisma.news.findMany({
            where: { tenantId: req.user.tenantId, status: 1 },
            orderBy: { date: 'desc' },
            include: { category: true }
        });
        res.json(news);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createNews = async (req, res) => {
    try {
        const { title, details, categoryName, image } = req.body;
        
        // Find or create the category (XAMPP parity)
        let category = await prisma.newsCategory.findFirst({ where: { name: categoryName, tenantId: req.user.tenantId } });
        if (!category) category = await prisma.newsCategory.create({ data: { name: categoryName, tenantId: req.user.tenantId } });

        const news = await prisma.news.create({
            data: {
                tenantId: req.user.tenantId,
                title, details, image,
                categoryId: category.id
            }
        });
        res.status(201).json(news);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// --- NOTICE LOGIC ---
const getNotices = async (req, res) => {
    try {
        const notices = await prisma.notice.findMany({
            where: { tenantId: req.user.tenantId, status: 1 },
            orderBy: { date: 'desc' },
            include: { category: true }
        });
        res.json(notices);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createNotice = async (req, res) => {
    try {
        const { title, details, categoryName } = req.body;
        
        let category = await prisma.noticeCategory.findFirst({ where: { name: categoryName, tenantId: req.user.tenantId } });
        if (!category) category = await prisma.noticeCategory.create({ data: { name: categoryName, tenantId: req.user.tenantId } });

        const notice = await prisma.notice.create({
            data: {
                tenantId: req.user.tenantId,
                title, details,
                categoryId: category.id
            }
        });
        res.status(201).json(notice);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc Update News
const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, details, categoryName, image } = req.body;
        
        let category = await prisma.newsCategory.findFirst({ where: { name: categoryName, tenantId: req.user.tenantId } });
        if (!category) category = await prisma.newsCategory.create({ data: { name: categoryName, tenantId: req.user.tenantId } });

        const updateData = { title, details, categoryId: category.id };
        if (image) updateData.image = image;

        await prisma.news.updateMany({
            where: { id: parseInt(id), tenantId: req.user.tenantId },
            data: updateData
        });
        res.json({ message: 'News updated successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc Update Notice
const updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, details, categoryName } = req.body;
        
        let category = await prisma.noticeCategory.findFirst({ where: { name: categoryName, tenantId: req.user.tenantId } });
        if (!category) category = await prisma.noticeCategory.create({ data: { name: categoryName, tenantId: req.user.tenantId } });

        await prisma.notice.updateMany({
            where: { id: parseInt(id), tenantId: req.user.tenantId },
            data: { title, details, categoryId: category.id }
        });
        res.json({ message: 'Notice updated successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getNews, createNews, getNotices, createNotice, updateNews, updateNotice };