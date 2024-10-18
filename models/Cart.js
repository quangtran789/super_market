const mongoose = require('mongoose');

// Định nghĩa mô hình CartItem
const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {  // Sửa lỗi chính tả ở đây
        type: Number,
        required: true,
        min: 1,
    }
});

// Định nghĩa mô hình Cart cho người dùng
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [cartItemSchema], // Mảng các mặt hàng trong giỏ
});

// Tạo các mô hình từ các schema
const CartItem = mongoose.model('CartItem', cartItemSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = { CartItem, Cart };
