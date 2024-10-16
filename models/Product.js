const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
        
    },
    quantity: {
        type: Number,
        required: true,
      },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId, // Kiểu dữ liệu là ObjectId để tham chiếu đến category
        required: true,
        ref: 'Category', // Tham chiếu đến mô hình Category
    },
    imageUrl: { // Thêm trường imageUrl
        type: String,
        required: true,
      },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
});

productSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;