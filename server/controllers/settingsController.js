const prisma = require('../utils/db');

exports.getSettings = async (req, res) => {
    try {
        const settings = await prisma.settings.findUnique({
            where: { organizationId: req.user.organizationId }
        });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { defaultLowStockThreshold } = req.body;
        const settings = await prisma.settings.update({
            where: { organizationId: req.user.organizationId },
            data: { defaultLowStockThreshold: parseInt(defaultLowStockThreshold) || 10 }
        });
        res.json(settings);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update settings' });
    }
};
