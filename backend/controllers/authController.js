const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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
    res.status(200).json(req.user);
};

// @desc    Forgot Password - Generates token and sends email
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(404).json({ message: "There is no user with that email." });

        // 1. Generate random token
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // 2. Hash it to save in DB securely
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        await prisma.user.update({
            where: { email },
            data: { resetPasswordToken, resetPasswordExpire }
        });

        // 3. Create the reset URL (pointing to your React frontend)
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // 4. Send the Email
        const html = `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Please click the link below to set a new password. This link expires in 10 minutes.</p>
            <a href="${resetUrl}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:10px;">Reset Password</a>
        `;

        await sendEmail({ email: user.email, subject: 'Password Reset Request', html });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: "Email could not be sent." }); 
    }
};

// @desc    Reset Password - Verifies token and saves new password
// @route   PUT /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
    try {
        // 1. Get hashed token from URL
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // 2. Find user with that exact token, checking that it hasn't expired yet
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken,
                resetPasswordExpire: { gt: new Date() } // Expire date must be Greater Than right now
            }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // 3. Hash new password and clear the reset fields
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpire: null
            }
        });

        res.status(200).json({ message: "Password updated successfully! You can now log in." });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { registerUser, loginUser, getMe, forgotPassword, resetPassword };