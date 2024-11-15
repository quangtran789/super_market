const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');
const orderRouter = express.Router();

orderRouter.post('/create', protect, asyncHandler(async (req, res) => {
    const { items, address, discountCode, discountValue } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!items || items.length === 0 || !address) {
        return res.status(400).json({ message: 'Thông tin đơn hàng không hợp lệ' });
    }

    // Lấy hình ảnh và tên sản phẩm từ Product model
    for (let item of items) {
        const product = await Product.findById(item.productId);
        if (product) {
            item.imageUrl = product.imageUrl;  // Gán hình ảnh
            item.name = product.name;   // Gán tên sản phẩm
        }
    }

    // Tính tổng giá trị đơn hàng với giá trị giảm giá
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0) - discountValue;

    // Tạo đơn hàng mới
    const order = await Order.create({
        userId: req.user._id,
        items,
        totalAmount,
        address,
        discountCode,
        discountValue,
        status: 'chưa giải quyết',
    });

    if (order) {
        res.status(201).json({ message: 'Đơn hàng được tạo thành công', order });
    } else {
        res.status(400).json({ message: 'Không thể tạo đơn hàng' });
    }
}));


// Lấy danh sách đơn hàng
orderRouter.get('/all', asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name')  // Nạp tên người dùng từ User model
            .populate({
                path: 'items.productId',  // Nạp thông tin sản phẩm từ Product model
                select: 'name price imageUrl',  // Lấy tên, giá và hình ảnh sản phẩm
            });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Không thể lấy danh sách đơn hàng', error });
    }
}));



orderRouter.put('/update/:id', protect, asyncHandler(async (req, res) => {
    const { id } = req.params; // Lấy ID từ params
    const { status } = req.body; // Lấy trạng thái từ body

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ['chưa giải quyết', 'xác nhận', 'đã vận chuyển', 'đã giao hàng', 'đã hủy bỏ'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID đơn hàng không hợp lệ' });
    }

    // Cập nhật trạng thái của đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (updatedOrder) {
        res.status(200).json({ message: 'Trạng thái đơn hàng đã được cập nhật', order: updatedOrder });
    } else {
        res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
}));


const mongoose = require('mongoose');
module.exports = orderRouter;