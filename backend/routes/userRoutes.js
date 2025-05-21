import express from 'express';
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route POST api/users/register
// @desc Register a new user
// @access Public

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        // create jwt payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        }

        // Sign and return the token along with the user data
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '30d'
        },
            (err, token) => {
                if (err) throw err;

                // send the user the token
                res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                });
            }
        );

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server Error" || error.message });
    }
})

// @route POST api/users/login
// @desc Login a user
// @access Public

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
        }

        // create jwt payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        }

        // Sign and return the token along with the user data
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '30d'
        },
            (err, token) => {
                if (err) throw err;

                // send the user the token
                res.json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                });
            }
        );

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server Error" || error.message });
    }
})

// @route GET api/users/profile
// @desc Get logged in user's profile (Protected Route) 
// @access Private

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(firstname)
        res.status(500).send({ message: error.message });
    }
})

// @route POST api/users/logout
// @desc Logout user
// @access Private

router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
})

export default router;