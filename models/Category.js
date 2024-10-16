const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: false,
    },
    imageUrl: { // Thêm trường hình ảnh
        type: String,
        required: false, // Không bắt buộc
    },
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;