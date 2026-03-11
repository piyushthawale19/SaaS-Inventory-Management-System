const prisma = require('../utils/db');

exports.getDashboard = async (req, res) => {
    try {
        const { organizationId } = req.user;

        const [products, settings] = await Promise.all([
            prisma.product.findMany({ where: { organizationId } }),
            prisma.settings.findUnique({ where: { organizationId } })
        ]);

        const globalThreshold = settings?.defaultLowStockThreshold || 10;

        let totalStock = 0;
        const lowStockItems = [];

        for (const p of products) {
            totalStock += p.quantity;
            const threshold = p.lowStockThreshold !== null ? p.lowStockThreshold : globalThreshold;

            if (p.quantity <= threshold) {
                lowStockItems.push({
                    id: p.id,
                    name: p.name,
                    sku: p.sku,
                    quantity: p.quantity,
                    threshold
                });
            }
        }

        res.json({
            totalProducts: products.length,
            totalStock,
            lowStockItems
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
};
