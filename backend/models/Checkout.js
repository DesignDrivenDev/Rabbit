import mongoose from "mongoose";



const checkoutItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        // required: true,
    },
    color: {
        type: String,
        // required: true,
    },
    quantity: {
        type: Number,
        min: 1,
        default: 1,
        required: true,
    },
}, {
    _id: false,
});

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    checkoutItems: [checkoutItemSchema],
    shippingAddress: {
        // fullName: {
        //     type: String,
        //     required: true,
        // },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    paymentMethod: {
        type: String,
        // required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: 'pending',
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed, //store payment-realted details(transaction id, paypal response, etc)
    },
    isFinalized: {
        type: Boolean,
        default: false,
    },
    finalizedAt: {
        type: Date,
    },

    // isDelivered: {  //isFinalized
    //     type: Boolean,
    //     default: false,
    // },
    // deliveredAt: { //finalizedAt
    //     type: Date,
    // }
}, {
    timestamps: true,
});

const Checkout = mongoose.model('Checkout', checkoutSchema);
export default Checkout;
