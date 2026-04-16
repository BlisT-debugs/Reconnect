const prisma = require('../config/prisma');

// @desc    Get all posts for the feed (includes likes and comments)
const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { tenantId: req.user.tenantId, status: 1 },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, role: true } }, // Don't send passwords/emails to the feed!
                media: true,
                likes: { select: { userId: true } }, // Just need to know WHO liked it to render the button correctly
                comments: {
                    include: { user: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        // Add a helper boolean so the frontend knows if the logged-in user liked it
        const formattedPosts = posts.map(post => ({
            ...post,
            isLikedByMe: post.likes.some(like => like.userId === req.user.id),
            likeCount: post.likes.length
        }));

        res.json(formattedPosts);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Create a new post
const createPost = async (req, res) => {
    try {
        const { body, mediaUrl } = req.body;
        
        const post = await prisma.post.create({
            data: {
                tenantId: req.user.tenantId,
                userId: req.user.id,
                body,
                media: mediaUrl ? {
                    create: [{ tenantId: req.user.tenantId, fileUrl: mediaUrl }]
                } : undefined
            }
        });
        res.status(201).json(post);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Toggle Like on a Post
const toggleLike = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.user.id;
        const tenantId = req.user.tenantId;

        // Check if like exists
        const existingLike = await prisma.postLike.findUnique({
            where: { postId_userId: { postId, userId } }
        });

        if (existingLike) {
            // Unlike it
            await prisma.postLike.delete({ where: { id: existingLike.id } });
            res.json({ message: 'Post unliked', liked: false });
        } else {
            // Like it
            await prisma.postLike.create({ data: { tenantId, postId, userId } });
            res.json({ message: 'Post liked', liked: true });
        }
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Add a comment to a Post
const addComment = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { body } = req.body;

        const comment = await prisma.postComment.create({
            data: {
                tenantId: req.user.tenantId,
                postId,
                userId: req.user.id,
                body
            },
            include: { user: { select: { id: true, name: true } } }
        });
        res.status(201).json(comment);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getPosts, createPost, toggleLike, addComment };