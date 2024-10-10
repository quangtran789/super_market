const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authRouter = express.Router();
const { protect } = require('../middlewares/authMiddleware');


//Dang ky nguoi dung
authRouter.post('/register', asyncHandler(async(req, res)=>{
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists){
        return res.status(400).json({message: "Tài khoản này đã có rồi"});
    }

    // Tạo người dùng mới
    const user = await User.create({ name, email, password });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), // Tạo token
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));


//Dang nhap nguoi dung
authRouter.post('/login', asyncHandler(async(req, res)=>{
    const { email, password }= req.body;

    // Tìm người dùng theo email trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    console.log('User found:', user);
    // Kiểm tra xem người dùng có tồn tại không và so sánh mật khẩu
    if (user) {
        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch); 

        if (isMatch) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id), // Tạo token
            });
        } else {
            res.status(401); // Unauthorized
            throw new Error('Email hoặc mật khẩu không hợp lệ');
        }
    } else {
        res.status(401); // Unauthorized
        throw new Error('Email hoặc mật khẩu không hợp lệ');
    }
}));


// Tạo token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token sẽ hết hạn sau 30 ngày
    });
};
// Route bảo vệ (ví dụ như lấy thông tin người dùng)
authRouter.get('/profile', protect, (req, res) => {
    res.json(req.user); // Trả về thông tin người dùng đã đăng nhập
});
module.exports = authRouter;