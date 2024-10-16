const express = require('express');
const categoryRouter = express.Router();
const { addCategory, getCategories, updateCategory, deleteCategory }= require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Thêm danh mục mới (POST)
categoryRouter.post('/categories', protect, admin, addCategory); // Thêm middleware cho route này

// Lấy tất cả danh mục (GET)
categoryRouter.get('/categories', getCategories); // Bạn có thể không cần middleware cho route này tùy thuộc vào yêu cầu



// Sửa danh mục (PUT)
categoryRouter.put('/categories/:id', protect, admin, updateCategory); // Thêm middleware cho route này

// Xóa danh mục (DELETE)
categoryRouter.delete('/categories/:id', protect, admin, deleteCategory); // Thêm middleware cho route này

module.exports= categoryRouter;