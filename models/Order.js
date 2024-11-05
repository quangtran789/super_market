const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    discountCode: { type: String },  // Thêm trường mã giảm giá
    discountValue: { type: Number, default: 0 },  // Thêm trường giá trị giảm giá
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
