import express from "express"
import Order from "../models/Order.js"
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js"

const router = express.Router()

// @route GET api/admin/orders
// @desc Get all orders (admin only)
// @access Private/Admin
router.get("/", authMiddleware, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        res.status(200).json(orders);
    } catch (error) {
        console.log("Error getting orders", error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})



// @route PUT /api/admin/orders/:id
// @desc Update an order status by id (admin only)
// @access Private/Admin
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params
    const { status, ...orderBody } = req.body
    try {
        const order = await Order.findById(id).populate("user", "name email");
        if (order) {
            order.status = status || order.status;
            // order.isDelivered = status === "delivered" ? true : order.isDelivered;
            // order.deliveredAt = status === "delivered" ? Date.now() : order.deliveredAt;
            if (status === "delivered") {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            } else {
                order.isDelivered = false;
                order.deliveredAt = order.deliveredAt;
            }

            const updatedOrder = await order.save();
            res.status(200).json(updatedOrder);
        } else {
            return res.status(404).send({ message: "Order not found" });
        }
    } catch (error) {
        console.log("Error updating ord status by admin user", error)
        res.status(500).send({ message: error.message });
    }
})

// @route DELETE /api/admin/orders/:id
// @desc Delete an order by id (admin only)
// @access Private/Admin
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.log("Error deleting order by admin user", error)
        res.status(500).send({ message: error.message });
    }
})


export default router