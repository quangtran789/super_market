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


// Đăng nhập người dùng
authRouter.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Tìm người dùng theo email trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    console.log('User found:', user);

    // Kiểm tra xem người dùng có tồn tại không và so sánh mật khẩu
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id), 
        });
    } else {
        res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
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

// Cập nhật địa chỉ của người dùng
authRouter.put('/update-address', protect, asyncHandler(async(req, res)=>{
    const { address } = req.body;

    if(!address){
        return res.status(400).json({ message: 'Vui lòng nhập địa chỉ' });
    }
    const user = await User.findById(req.user._id);

    if (user) {
        // Nếu người dùng có địa chỉ trước đó, trả về địa chỉ hiện tại
        if (user.address) {
            return res.status(200).json({
                message: 'Địa chỉ hiện tại của bạn',
                currentAddress: user.address,
            });
        }

        // Nếu không có địa chỉ hiện tại, cập nhật địa chỉ mới
        user.address = address;
        await user.save();
        res.status(200).json({ message: 'Cập nhật địa chỉ thành công', address: user.address });
    } else {
        res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
}));

// Lấy địa chỉ hiện tại của người dùng
authRouter.get('/current-address', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.status(200).json({ address: user.address }); // Trả về địa chỉ hiện tại
    } else {
        res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
}));


// Xóa tài khoản của người dùng
authRouter.delete('/delete-account', protect, asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Tìm và xóa người dùng theo ID
    const user = await User.findByIdAndDelete(userId);

    if (user) {
        res.status(200).json({ message: 'Xóa tài khoản thành công' });
    } else {
        res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
}));
// Cập nhật thông tin người dùng (name và email)
authRouter.put('/update-info', protect, asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        // Cập nhật thông tin người dùng
        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();
        res.status(200).json({
            message: 'Cập nhật thông tin thành công',
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
}));






module.exports = authRouter;