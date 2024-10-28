const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');
const orderRouter = express.Router();


// Đặt hàng từ giỏ hàng
orderRouter.post('/place-order', protect, asyncHandler(async(req, res)=>{
    
    const userId = req.user._id;
    const { address } = req.body;

    // Lấy danh sách sản phẩm trong giỏ hàng của người dùng
    const userCart = await Cart.find({ userId }).populate('productId');
    if (!userCart || userCart === 0) {
        return res.status(400).json({ message: 'Giỏ hàng trống' });
    }
    let totalPrice =0;
    const orderItems = [];

     // Tạo danh sách sản phẩm cho đơn hàng và tính tổng tiền
    for(const item of userCart){
        const { productId, quantity } = item;
        const product = await Product.findById(productId);
        
        if(product && product.quantity >= quantity){
            orderItems.push({
                productId: product._id,
                quantity: quantity,
                price: product.price,
            });
            totalPrice += product.price *quantity;

            // Cập nhật số lượng sản phẩm trong kho
            product.quantity -= quantity;
            await product.save();
        }else{
            return res.status(400).json({message: `Sản phẩm ${product.name} không đủ số lượng` });
        }
    }
    //Tạo đơn hàng
    const newOrder = new Order({
        userId,
        items: orderItems,
        totalPrice,
        address,
    });
    await newOrder.save();

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await Cart.deleteMany({ userId });
    res.status(201).json({ message: 'Đặt hàng thành công', order: newOrder });
}));

module.exports = orderRouter;