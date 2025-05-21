import express from "express";
import Order from "../models/Order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route POST api/orders/my-orders
// @desc Get logged in user's orders
// @access Private
router.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        // Find orders for the logged in user
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });//sort by createdAt in most recent orders
        res.status(200).json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})

// @route GET api/orders/:id
// @desc Get an order by id
// @access Private
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) {
            res.status(404).send({ message: "Order not found" });
        }
        // return the full order
        res.status(200).json(order);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})

export default router;
