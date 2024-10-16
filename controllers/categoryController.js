const Category = require('../models/Category');

// Thêm danh mục mới (POST)
const addCategory = async (req, res) => {
    const { name, description, imageUrl } = req.body; // Lấy imageUrl từ request body

    try {
        const newCategory = new Category({
            name,
            description,
            imageUrl // Lưu trữ hình ảnh
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
};

// Lấy tất cả danh mục (GET)
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories' });
    }
};

// Sửa danh mục (PUT)
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body; // Thêm imageUrl vào request body

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description, imageUrl }, // Cập nhật cả imageUrl
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
};

// Xóa danh mục (DELETE)
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};

module.exports = {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
};
