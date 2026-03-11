const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/db');

exports.signup = async (req, res) => {
    const { orgName, email, password } = req.body;

    if (!orgName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);

        // Create org, settings, and user in a transaction
        const org = await prisma.organization.create({
            data: {
                name: orgName,
                settings: { create: { defaultLowStockThreshold: 10 } }
            }
        });

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hash,
                organizationId: org.id
            }
        });

        const token = jwt.sign(
            { userId: user.id, organizationId: org.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, { httpOnly: true, secure: false, path: '/' })
            .json({ success: true, user: { id: user.id, email: user.email } });
    } catch (err) {
        if (err.code === 'P2002') return res.status(400).json({ error: 'Email already exists' });
        res.status(500).json({ error: 'Signup failed' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user.id, organizationId: user.organizationId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, { httpOnly: true, secure: false, path: '/' })
            .json({ success: true, user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Login error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: { organization: true }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({
            id: user.id,
            email: user.email,
            orgName: user.organization.name
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
