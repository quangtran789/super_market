const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware bảo vệ
const protect = async (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Lấy thông tin người dùng mà không có mật khẩu
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};

// Middleware kiểm tra vai trò admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
