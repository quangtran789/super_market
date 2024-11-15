const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            imageUrl: { type: String }, 
            name: { type: String },
        },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    discountCode: { type: String },  // Thêm trường mã giảm giá
    discountValue: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['chưa giải quyết', 'xác nhận', 'đã vận chuyển', 'đã giao hàng', 'đã hủy bỏ'], 
        default: 'chưa giải quyết' 
    } // Thêm trường trạng thái
}, { timestamps: true });


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
