const express = require('express');
const DiscountCode = require('../models/DiscountCode');
const discountRouter = express.Router(); // Đổi tên router thành discountRouter

// Lấy danh sách mã giảm giá
discountRouter.get('/', async (req, res) => {
  try {
    const codes = await DiscountCode.find();
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discount codes' });
  }
});

// Áp dụng mã giảm giá
discountRouter.post('/apply', async (req, res) => {
    const { code } = req.body;
    
    try {
      const discount = await DiscountCode.findOne({ code: code, isValid: true });
      
      if (!discount) {
        return res.status(400).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' });
      }
      
      // Nếu mã giảm giá hợp lệ, trả về giá trị giảm giá
      res.status(200).json({ discountValue: discount.discountValue });
    } catch (error) {
      res.status(500).json({ message: 'Đã xảy ra lỗi khi áp dụng mã giảm giá.' });
    }
  });

// Tạo mã giảm giá mới (Admin)
discountRouter.post('/add', async (req, res) => {
    const { code, discountValue, isValid, expiryDate } = req.body;
  
    try {
      const discountCode = new DiscountCode({ code, discountValue, isValid, expiryDate });
      await discountCode.save();
      res.status(201).json(discountCode);
    } catch (error) {
      res.status(500).json({ message: 'Error creating discount code' });
    }
  });

  // Xóa mã giảm giá theo ID
discountRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCode = await DiscountCode.findByIdAndDelete(id);

    if (!deletedCode) {
      return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
    }

    res.status(200).json({ message: 'Đã xóa mã giảm giá thành công', deletedCode });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting discount code' });
  }
});
// Xóa mã giảm giá theo ID
discountRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCode = await DiscountCode.findByIdAndDelete(id);

    if (!deletedCode) {
      return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
    }

    res.status(200).json({ message: 'Đã xóa mã giảm giá thành công', deletedCode });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting discount code' });
  }
});

module.exports = discountRouter; // Xuất discountRouter
