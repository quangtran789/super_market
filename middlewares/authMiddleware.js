const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers,authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];// Lấy token từ header

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm người dùng trong cơ sở dữ liệu
            req.user = await User.findById(decoded.id).select('-password');// Không trả về mật khẩu
            next(); // Tiếp tục đến route tiếp theo
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' }); // Unauthorized
        }
    }
    if(!token){
        res.status(401).json({message:'Not authorized, no token'})
    }
};
module.exports = { protect };