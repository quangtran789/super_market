 const mongoose = require('mongoose');
 const bcrypt = require('bcrypt');


 const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
              const re =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
              return value.match(re);
            },
            message: "Hãy nhập đầy đủ email",
          },
    },
    password:{
        type: String, 
        required:true,
    },
    address: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  // Xác định người dùng là 'user' hay 'admin'
        default: 'user',  // Mặc định là 'user'
    },
 },{
    timestamps: true,
 });

 // Mã hóa mật khẩu trước khi lưu
//  pre('save') là một middleware trong Mongoose, được kích hoạt trước khi lưu tài liệu vào cơ sở dữ liệu.
// this.isModified('password') kiểm tra xem trường password có bị thay đổi không. Điều này giúp ngăn việc mã hóa lại mật khẩu nếu bạn chỉnh sửa thông tin khác của người dùng (như tên, email) mà không thay đổi mật khẩu.
// Nếu không có thay đổi mật khẩu, hàm next() sẽ được gọi để tiếp tục quy trình lưu mà không mã hóa lại.
// bcrypt.genSalt(10) tạo một "muối" (salt) với độ phức tạp là 10. "Muối" là một chuỗi ngẫu nhiên được thêm vào mật khẩu trước khi mã hóa, giúp tăng cường tính bảo mật.
// bcrypt.hash(this.password, salt): Mã hóa mật khẩu bằng cách sử dụng "muối" đã tạo. Mật khẩu sau khi được mã hóa sẽ được lưu trong cơ sở dữ liệu thay vì lưu mật khẩu dạng plain text (chữ rõ).
 userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
 });

 //So sanh mat khau
//  matchPassword là một phương thức (method) của mô hình User dùng để so sánh mật khẩu người dùng nhập vào với mật khẩu đã được mã hóa và lưu trong cơ sở dữ liệu.
// bcrypt.compare(enteredPassword, this.password):
// enteredPassword: Là mật khẩu mà người dùng nhập vào khi đăng nhập.
// this.password: Là mật khẩu đã được mã hóa và lưu trong cơ sở dữ liệu.
// bcrypt.compare kiểm tra xem mật khẩu được nhập vào có khớp với mật khẩu đã được mã hóa hay không.
// Kết quả trả về là true nếu mật khẩu khớp, false nếu không khớp.
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


 const User = mongoose.model('User', userSchema);
 module.exports = User;