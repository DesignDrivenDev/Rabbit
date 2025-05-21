import { authMiddleware } from "../middleware/authMiddleware.js";
import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

// Helper function to get a cart by user ID or guest ID
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId: guestId });
    }
    return null;
}



// @route POST /api/cart
// @desc Add a new product to cart for a logged in user/guest
// @access public

router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Determine if the user is a guest or logged in
        let cart = await getCart(userId, guestId);

        //if the cart exists, update it
        if (cart) {
            const productIndex = cart.products.findIndex(
                (item) =>
                    item.productId.toString() === productId &&
                    item.size === size &&
                    item.color === color
            );

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({
                    productId: productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size: size,
                    color: color,
                    quantity: quantity,
                });
            }

            // cart.totalPrice += product.price * quantity;
            // calculate total price
            cart.totalPrice = cart.products.reduce((total, item) => {
                return total + item.price * item.quantity;
            }, 0)

            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create a new cart for the guest user
            const newCart = new Cart({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + Date.now(),
                products: [
                    {
                        productId: productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size: size,
                        color: color,
                        quantity: quantity,
                    }
                ],
                totalPrice: product.price * quantity,
            });
            await newCart.save();
            return res.status(200).json(newCart);
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error adding product to cart" || error.message });
    }
    res.status(200).json(newCart);
});

// @route PUT /api/cart
// @desc Update product quantity in cart for a logged in user/guest
// @access public

router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );
        if (productIndex > -1) {
            //   update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1);//remove product if quantity is 0
            }

            cart.totalPrice = cart.products.reduce((total, item) => {
                return total + item.price * item.quantity;
            }, 0)
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).send({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error updating product quantity in cart" || error.message });

    }
})

// @route DELETE /api/cart
// @desc Delete product from cart for a logged in user/guest
// @access public

router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0)
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).send({ message: "Product not found in cart" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error deleting product from cart" || error.message });
    }
})

// @route GET /api/cart
// @desc Get cart by user ID or guest ID
// @access public
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;
    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).send({ message: "Cart not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})

//@route POST /api/cart/merge
//@desc Merge guest cart with user cart on login
//@access Private
router.post("/merge", authMiddleware, async (req, res) => {
    const { guestId } = req.body;
    try {
        // Finf the guest cart and user cart
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(404).send({ message: "Guest cart is empty" });
            }

            if (userCart) {
                // Merge guest cart into user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (item) =>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        // if item already exists in user cart, update quantity
                        userCart.products[productIndex].quantity += guestItem.quantity
                    } else {
                        // Otherwise, add guest cart item to user cart
                        userCart.products.push(guestItem);
                    }
                });

                // Update total price of user cart
                userCart.totalPrice = userCart.products.reduce((total, item) => total + item.price * item.quantity, 0)

                // Delete guest cart
                await userCart.save();

                // Remove guest cart after merging
                try {
                    await Cart.findOneAndDelete({ guestId })
                } catch (error) {
                    console.error("Error deleting guest cart:", error);
                }

                res.status(200).json(userCart);
            } else {
                // if the user has no exsting cart, assign the guest cart tot the user cart
                guestCart.user = req.user._id;
                guestCart.guestId = undefined
                await guestCart.save();

                return res.status(200).json(guestCart);
            }
        } else {
            if (userCart) {
                // Guest cart has already been merged, reutrn user cart
                return res.status(200).json(userCart);
            }
            res.status(404).send({ message: "Guest cart not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Server error" || error.message });
    }
})



export default router;