const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Generate JWT Token
const generateToken = (id, tenantId) => {
    return jwt.sign({ id, tenantId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, tenantId } = req.body;

        // 1. Validate input
        if (!name || !email || !password || !tenantId) {
            return res.status(400).json({ message: 'Please add all fields, including a Tenant ID' });
        }

        // 2. Check if user already exists
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                tenantId // Must match a valid Tenant ID in the database
            }
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.tenantId)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await prisma.user.findUnique({ where: { email } });

        // 2. Verify password
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.tenantId)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current logged in user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // Because of our middleware, req.user already contains the secure user data!
    res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe };