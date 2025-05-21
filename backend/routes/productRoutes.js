import express from "express";
import Product from "../models/Product.js";
import jwt from 'jsonwebtoken';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route POST api/products
// @desc Create a new product
// @access Private/Admin
router.post('/', authMiddleware, isAdmin, async (req, res) => {
    const {
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        brand,
        sizes,
        colors,
        collections,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        dimensions,
        weight,
        sku
    } = req.body;

    try {
        const product = await Product.create({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id //Reference to the admin who created the user who created the product
        });
        res.status(201).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error creating product" || error.message });
    }
})

// @route PUT api/products/:id
// @desc Update a product by id
// @access Private/Admin
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
    const {
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        brand,
        sizes,
        colors,
        collections,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        dimensions,
        weight,
        sku
    } = req.body;

    try {
        const product = await Product.findByIdAndUpdate(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // save the updated product
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            return res.status(404).send({ message: "Product not found" });
        }


    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error updating product" || error.message });
    }
})

// @route DELETE api/products/:id
// @desc Delete a product by id
// @access Private/Admin
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error deleting product" || error.message });
    }
})

// @route GET api/products
// @desc Get all products with optional query filters 
// @access Public
router.get('/', async (req, res) => {
    try {
        const {
            collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            brand,
            material,
            limit
        } = req.query;

        let query = {}

        // filter logic

        if (collection && collection.toLocaleLowerCase() !== 'all') {
            query.collections = collection
        }

        if (category && category.toLocaleLowerCase() !== 'all') {
            query.category = category
        }

        if (material) {
            query.material = { $in: material.split(',') }
        }

        if (brand) {
            query.brand = { $in: brand.split(',') }
        }

        if (size) {
            query.sizes = { $in: size.split(',') }
        }

        if (color) {
            query.colors = { $in: [color] }
        }

        if (gender) {
            query.gender = gender
        }

        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) {
                query.price.$gte = Number(minPrice)
            }
            if (maxPrice) {
                query.price.$lte = Number(maxPrice)
            }
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        // sort logic
        let sort = {}
        if (sortBy) {
            switch (sortBy) {
                case 'featured':
                    sort = { isFeatured: true }
                    break;
                case 'newest':
                    sort = { createdAt: -1 }
                    break;
                case 'priceAsc':
                    sort = { price: 1 }
                    break;
                case 'priceDesc':
                    sort = { price: -1 }
                    break;
                case "popularity":
                    sort = { rating: -1 }
                    break;
                default:
                    break;
            }
        }

        // fetch the products from the database
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);

        // const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})


// @route GET /api/products/best-seller
// @desc Get products with highest rating
// @access Public
router.get('/best-seller', async (req, res) => {
    try {
        const products = await Product.findOne().sort({ rating: -1 }).limit(4);
        if (products) {
            res.status(200).json(products);
        } else {
            res.status(404).send({ message: "No best seller found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})


// @route GET /api/products/new-arrivals
// @desc Retrive newly added products - Creation date
// @access Public
router.get('/new-arrivals', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
        if (products) {
            res.status(200).json(products);
        } else {
            res.status(404).send({ message: "No best seller found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})

// @route GET api/products/:id
// @desc Get a product by id
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})


// route GET api/products/similar/:id
// @desc Get similar products based on the current product's gender and category
// @access Public

router.get('/similar/:id', async (req, res) => {

    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).send({ message: "Product not found" });
        }
        const similarProducts = await Product.find({
            gender: product.gender,
            category: product.category,
            _id: { $ne: id } // exclude the current product
        }).limit(8);
        res.status(200).json(similarProducts);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})



export default router;


// router.post('/', authMiddleware, isAdmin, async (req, res) => {
//     const {
//         name,
//         description,
//         price,
//         discountPrice,
//         countInStock,
//         category,
//         brand,
//         sizes,
//         colors,
//         collections,
//         material,
//         gender,
//         images,
//         isFeatured,
//         isPublished,
//         tags,
//         dimensions,
//         weight,
//         sku
//     } = req.body;

//     try {
//         const product = await Product.create({
//             name,
//             description,
//             price,
//             discountPrice,
//             countInStock,
//             category,
//             brand,
//             sizes,
//             colors,
//             collections,
//             material,
//             gender,
//             images,
//             isFeatured,
//             isPublished,
//             tags,
//             dimensions,
//             weight,
//             sku,
//             user: req.user._id //Reference to the admin who created the user who created the product
//         });
//         res.status(201).json(product);
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({ message: "Error creating product" || error.message });
//     }
// })


// if (sortBy === 'featured') {
//     query.isFeatured = true;
// } else if (sortBy === 'newest') {
//     query.createdAt = -1;
// } else if (sortBy === 'priceAsc') {
//     query.price = 1;
// } else if (sortBy === 'priceDesc') {
//     query.price = -1;
// } else if (sortBy === 'popularity') {
//     query.rating = -1
// }