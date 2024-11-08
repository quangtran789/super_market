const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/authMiddleware');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const cartRouter = express.Router();

// Thêm sản phẩm vào giỏ hàng
cartRouter.post('/add', protect, asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Kiểm tra xem sản phẩm có tồn tại hay không
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let cartItem = await Cart.findOne({ userId, productId });
    if (cartItem) {
        // Nếu có rồi, tăng số lượng
        cartItem.quantity += quantity;
    } else {
        // Nếu chưa có, thêm sản phẩm vào giỏ hàng
        cartItem = new Cart({ userId, productId, quantity });
    }

    await cartItem.save();
    res.status(201).json(cartItem);
}));

// Lấy danh sách sản phẩm trong giỏ hàng của người dùng
cartRouter.get('/:userId', protect, asyncHandler(async (req, res) => {
    const { userId } = req.params;
    try {
        const cartItems = await Cart.find({ userId }).populate('productId'); // Sử dụng `populate` để lấy thông tin sản phẩm
        if (cartItems.length > 0) {
            res.status(200).json(cartItems);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));



// Cập nhật số lượng sản phẩm trong giỏ hàng
cartRouter.put('/update/:id', protect, asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const cartItemId = req.params.id;

    const cartItem = await Cart.findById(cartItemId);
    if (!cartItem) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }

    // Cập nhật số lượng sản phẩm
    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
}));

// Xóa sản phẩm khỏi giỏ hàng
cartRouter.delete('/remove/:id', protect, asyncHandler(async (req, res) => {
    const cartItemId = req.params.id;

    const cartItem = await Cart.findByIdAndDelete(cartItemId);
    if (!cartItem) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa khỏi giỏ hàng' });
    }

    res.status(200).json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
}));

// Xóa toàn bộ sản phẩm khỏi giỏ hàng
cartRouter.delete('/clear/:userId', protect, asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        // Xóa tất cả sản phẩm trong giỏ hàng của người dùng
        const result = await Cart.deleteMany({ userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Giỏ hàng rỗng hoặc không tìm thấy' });
        }

        res.status(200).json({ message: 'Đã xóa toàn bộ sản phẩm trong giỏ hàng' });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));

// Tăng số lượng sản phẩm trong giỏ hàng
cartRouter.put('/increase/:id', protect, asyncHandler(async (req, res) => {
    const cartItemId = req.params.id;

    const cartItem = await Cart.findById(cartItemId);
    if (!cartItem) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }

    // Tăng số lượng sản phẩm lên 1
    cartItem.quantity += 1;
    await cartItem.save();
    res.json(cartItem);
}));


// Giảm số lượng sản phẩm trong giỏ hàng
cartRouter.put('/decrease/:id', protect, asyncHandler(async (req, res) => {
    const cartItemId = req.params.id;

    const cartItem = await Cart.findById(cartItemId);
    if (!cartItem) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }

    // Nếu số lượng lớn hơn 1, giảm số lượng
    if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await cartItem.save();
        res.json(cartItem);
    } else {
        // Nếu số lượng sản phẩm bằng 1, có thể xóa sản phẩm khỏi giỏ hàng
        await Cart.findByIdAndDelete(cartItemId);
        res.status(200).json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng vì số lượng bằng 1' });
    }
}));


module.exports = cartRouter;
