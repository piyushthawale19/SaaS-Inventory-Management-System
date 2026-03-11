const prisma = require('../utils/db');

exports.getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { organizationId: req.user.organizationId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;
        const product = await prisma.product.create({
            data: {
                organizationId: req.user.organizationId,
                name,
                sku,
                description,
                quantity: parseInt(quantity) || 0,
                costPrice: parseFloat(costPrice) || 0,
                sellingPrice: parseFloat(sellingPrice) || 0,
                lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : null
            }
        });
        res.json(product);
    } catch (err) {
        if (err.code === 'P2002') return res.status(400).json({ error: 'SKU must be unique' });
        res.status(400).json({ error: 'Failed to create product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;
        const product = await prisma.product.update({
            where: {
                id: req.params.id,
                organizationId: req.user.organizationId
            },
            data: {
                name, sku, description,
                quantity: quantity !== undefined ? parseInt(quantity) : undefined,
                costPrice: costPrice !== undefined ? parseFloat(costPrice) : undefined,
                sellingPrice: sellingPrice !== undefined ? parseFloat(sellingPrice) : undefined,
                lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold) : undefined
            }
        });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await prisma.product.delete({
            where: {
                id: req.params.id,
                organizationId: req.user.organizationId
            }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete product' });
    }
};
