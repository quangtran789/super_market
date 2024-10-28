const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity:{
                type: Number,
                required: true,
            },
            price:{
                type: Number,
                required: true,
            },
        }
    ],
    totalPrice:{
        type: Number,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        default: 'pending',
    },
    paymentMethod:{
        type: String,
        enum: ['cash', 'card'],
        required: true,
    }
},{
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);