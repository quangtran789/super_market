const express = require('express');
const Product = require('../models/Product');
const productRouter = express.Router();

// Thêm sản phẩm
productRouter.post('/', async (req, res) => {
    try {
        const { name, description, price, quantity, categoryId, imageUrl } = req.body;
    
        // Kiểm tra xem categoryId có hợp lệ không
        if (!categoryId) {
          return res.status(400).json({ message: 'CategoryId is required' });
        }
    
        const product = new Product({
          name,
          description,
          price,
          quantity,
          categoryId,
          imageUrl,
        });
    
        await product.save();
        res.status(201).json(product);
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
});

  // Lấy danh sách sản phẩm(GET)
productRouter.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Lấy tất cả sản phẩm từ cơ sở dữ liệu
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


productRouter.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId');
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error });
    }
});




productRouter.put('/:id', async (req, res) => {
    const updateFields = req.body;

    try {
        // Tìm và cập nhật sản phẩm theo ID, chỉ cập nhật các trường có trong request body
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields }, // Sử dụng $set để chỉ cập nhật các trường có giá trị
            { new: true, runValidators: true } // Trả về sản phẩm đã cập nhật và kiểm tra dữ liệu
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để sửa' });
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(400).json({ message: 'Lỗi khi sửa sản phẩm', error });
    }
});




  // Xóa sản phẩm
  productRouter.delete('/:id', async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
      }
      res.status(200).json({ message: 'Đã xóa sản phẩm thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
    }
  });
 
  productRouter.get("/search/:name", async (req, res) => {
    try {
      const products = await Product.find({
        name: { $regex: req.params.name, $options: "i" },
      });
  
      res.json(products);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  




module.exports = productRouter;
