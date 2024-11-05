const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');
const orderRouter = express.Router();

orderRouter.post('/create', protect, asyncHandler(async(req, res) => {
    const { items, address, discountCode, discountValue } = req.body; // Nhận discountCode và discountValue từ body

    // Kiểm tra nếu không có sản phẩm hoặc địa chỉ
    if (!items || items.length === 0 || !address) {
        return res.status(400).json({ message: 'Thông tin đơn hàng không hợp lệ' });
    }

    // Tính tổng giá trị đơn hàng với discountValue
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0) - discountValue; // Áp dụng discountValue vào tổng

    // Tạo đơn hàng
    const order = await Order.create({
        userId: req.user._id,
        items,
        totalAmount,
        address,
        discountCode, // Thêm discountCode vào đơn hàng
        discountValue, // Thêm discountValue vào đơn hàng
    });

    if (order) {
        res.status(201).json({ message: 'Đơn hàng được tạo thành công', order });
    } else {
        res.status(400).json({ message: 'Không thể tạo đơn hàng' });
    }
}));

  

// Lấy danh sách đơn hàng của người dùng
orderRouter.get('/my-orders', protect, asyncHandler(async(req, res)=>{
    const orders =await Order.find({ userId: req.user._id }).populate('items.productId');
    if(orders){
        res.status(200).json(orders);
    }else{
        res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }
}));

module.exports = orderRouter;