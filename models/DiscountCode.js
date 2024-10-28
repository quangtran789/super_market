const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountValue: { type: Number, required: true },
  isValid: { type: Boolean, default: true },
  expiryDate: { type: Date } // Thêm thời gian hết hạn nếu cần
}, {
  timestamps: true,
});

const DiscountCode = mongoose.model('DiscountCode', discountCodeSchema);
module.exports = DiscountCode;
