import jwt from 'jsonwebtoken';
import User from '../models/User.js';


// midleware to protect routes
export const authMiddleware = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        let token;
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.user.id).select('-password'); //exclude password

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = user;

            next();
        } catch (error) {
            console.log("Token verfication failed", error)
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};


// middleware to check if user is admin or not
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
}
