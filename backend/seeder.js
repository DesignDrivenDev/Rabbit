import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import products from "./data/products.js";

dotenv.config();

// connect to database
mongoose.connect(process.env.MONGO_URI)

// function to seed database
const seedDatabase = async () => {
    try {
        // clear existing data in database
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // Create a default Admin user
        const createdUser = await User.create({
            name: 'admin',
            email: 'admin@example.com',
            password: '123456',
            role: 'admin'
        });

        // Assign the default user ID to each product
        const userID = createdUser._id;
        const sampleProducts = products.map(product => {
            return { ...product, user: userID };
        });

        // Insert sample products
        await Product.insertMany(sampleProducts);

        console.log("Products seeded successfully!");
        process.exit();
    } catch (error) {
        console.log("Error seeding products:", error);
        process.exit(1);
    }
}

seedDatabase();