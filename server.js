const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/userRouters');
const categoryRoutes = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const cors = require('cors');
const orderRouter = require('./routes/orderRouter');
const discountRouter = require('./routes/discountRoutes');

// Khởi tạo ứng dụng Express
const app = express();

// Cấu hình dotenv để quản lý biến môi trường
dotenv.config();
app.use(cors());
// Middleware để parse JSON
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));

// Sử dụng router cho người dùng
app.use('/api/users', authRoutes);// Sử dụng route cho category
app.use('/api', categoryRoutes);
app.use('/api/products', productRouter); // Đặt route cho sản phẩm
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/discount-codes', discountRouter);
// Tạo một route đơn giản
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Lắng nghe server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});