import express from "express";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();


// @route POST api/subscribe
// @desc Subscribe to newsletter
// @access Public

router.post("/", async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        const subscriberExists = await Subscriber.findOne({ email });
        if (subscriberExists) {
            res.status(400).json({ message: 'Email is already subscribed' });
        }

        const subscriber = await Subscriber.create({
            email,
        });

        res.status(201).json({ message: 'Subscribed successfully to the newsletter!' });
    } catch (error) {
        console.log("Error subscribing to newsletter:", error);
        res.status(500).send({ message: "Server error" || error.message });
    }
})

export default router;