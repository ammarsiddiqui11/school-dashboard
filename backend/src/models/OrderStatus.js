
const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
  collect_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  custom_order_id: { type: String },
  gateway_collect_id: { type: String },   // 🔹 add this field
  order_amount: Number,
  transaction_amount: Number,
  status: { type: String, default: 'pending' },
  payment_mode: String,
  payment_details: String,
  bank_reference: String,
  payment_message: String,
  error_message: String,
  payment_time: Date
});

module.exports = mongoose.model('OrderStatus', orderStatusSchema);
