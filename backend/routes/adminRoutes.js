import express from "express";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


// @route GET api/admin/users
// @desc Get all users (admin only)
// @access Private/Admin
router.get("/", authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.log("Error getting users", error)
        res.status(500).send({ message: error.message });
    }
})

// @route POST /api/admin/users
// @desc Add a new user (admin only)
// @access Private/Admin
router.post("/", authMiddleware, isAdmin, async (req, res) => {
    const { email, password, role, name } = req.body;
    try {
        if (!email || !password || !role || !name) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role: role || "customer"
        });
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.log("Error creating user by admin", error)
        res.status(500).send({ message: "Error creating user by admin" || error.message });
    }
})

// @route PUT api/admin/users/:id
// @desc Update a user info by id (admin only)- Name, email, role
// @access Private/Admin

router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params
    const { email, role, name } = req.body;
    try {
        const user = await User.findById(id);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role;
        } else {
            return res.status(404).send({ message: "User not found" });
        }
        const updatedUser = await user.save();
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log("Error updating user by admin", error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})

// @route DELETE api/admin/users/:id
// @desc Delete a user by id (admin only)
// @access Private/Admin
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log("Error deleting user by admin", error)
        res.status(500).send({ message: error.message });
    }
})


// // @route GET api/admin/users/:id
// // @desc Get a user by id (admin only)
// // @access Private/Admin
// router.get("/:id", authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// })

// // @route DELETE api/admin/users/:id
// // @desc Delete a user by id (admin only)
// // @access Private/Admin
// router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         res.status(200).json({ message: "User deleted successfully" });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// })

// // @route PUT api/admin/users/:id
// // @desc Update a user by id (admin only)
// // @access Private/Admin
// router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// })



export default router;