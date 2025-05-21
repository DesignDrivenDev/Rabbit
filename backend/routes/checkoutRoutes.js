import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Checkout from "../models/Checkout.js";
import Cart from "../models/Cart.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//  @route POST api/checkout
//  @desc Create a new checkout session
//  @access Private
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
        if (!checkoutItems || checkoutItems.length === 0) {
            res.status(400).json({ message: "No items in the cart." });
        }

        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false,
            quantity: checkoutItems.reduce((a, c) => a + c.quantity, 0),
        })

        console.log(`Checkout created for the user: ${req.user._id}`);

        res.status(201).json(newCheckout);
    } catch (error) {
        console.log("Error creating checkout session:", error);
        res.status(500).send({ message: "Server error" || error.message });
    }
})


// @route PUT api/checkout/:id/pay
// @desc Update a checkout to mark it as paid after successful payment
// @access Private
router.put("/:id/pay", authMiddleware, async (req, res) => {
    try {
        const { paymentStatus, paymentDetails } = req.body;

        const checkout = await Checkout.findByIdAndUpdate(req.params.id);

        if (!checkout) {
            return res.status(404).send({ message: "Checkout not found" });
        }

        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();

            await checkout.save();

            res.status(200).json(checkout);
            console.log(`Payment status updated for user: ${req.user._id}`);
        } else {
            res.status(400).send({ message: "Invalid payment status" });
        }
    } catch (error) {
        console.log("Error updating checkout session:", error);
        res.status(500).send({ message: "Server error" || error.message });
    }
})


// @route POST api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation 
// @access Private
router.post("/:id/finalize", authMiddleware, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(400).send({ message: "Checkout is not found" });
        }
        if (checkout.isPaid && !checkout.isFinalized) {
            // Create final order from the checkout deatils
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails,
            });
            // Mark the Checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            // Delete the cart items associated with the user
            await Cart.findOneAndDelete({ user: checkout.user });
            res.status(200).json(finalOrder);
            console.log(`Payment finalized for user: ${req.user._id}`);
        } else if (checkout.isFinalized) {
            res.status(400).send({ message: "Checkout is already finalized" });
        } else {
            res.status(400).send({ message: "Checkout is not paid" });
        }
    } catch (error) {
        console.log("Error finalizing checkout:", error);
        res.status(500).send({ message: "Server error" || error.message });
    }
})



// done by me
// @route GET api/checkout/:id
// @desc Get a checkout by id
// @access Private
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (checkout) {
            res.status(200).json(checkout);
        } else {
            res.status(404).send({ message: "Checkout not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})

export default router;