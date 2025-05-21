import express from "express"
import Product from "../models/Product.js"
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js"

const router = express.Router()

// @route GET api/admin/products
// @desc Get all products (admin only)
// @access Private/Admin
// router.get("/", authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const products = await Product.find({});
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// })


// @route   GET /api/admin/products?page=1&limit=10
// @desc    Get all or paginated products (admin only)
// @access  Private/Admin
router.get("/", authMiddleware, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        // If page and limit are provided, paginate
        if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;

            const [products, totalCount] = await Promise.all([
                Product.find().skip(skip).limit(limit),
                Product.countDocuments()
            ]);

            return res.status(200).json({
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                products,
            });
        }

        // Else, return all products
        const products = await Product.find();
        res.status(200).json({
            totalItems: products.length,
            products,
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ message: error.message });
    }
});


// @route   GET /api/admin/products?page=1&limit=10
// @desc    Get paginated list of products (admin only)
// @access  Private/Admin
// router.get("/", authMiddleware, isAdmin, async (req, res) => {
//     try {
//         // Get query params with default values
//         const page = parseInt(req.query.page) || 1;       // Current page number
//         const limit = parseInt(req.query.limit) || 10;    // Items per page

//         const skip = (page - 1) * limit;

//         // Fetch products and count total
//         const [products, totalCount] = await Promise.all([
//             Product.find().skip(skip).limit(limit),
//             Product.countDocuments()
//         ]);

//         res.status(200).json({
//             page,
//             limit,
//             totalPages: Math.ceil(totalCount / limit),
//             totalItems: totalCount,
//             products,
//         });
//     } catch (error) {
//         console.error("Error fetching paginated products:", error);
//         res.status(500).send({ message: error.message });
//     }
// });

export default router