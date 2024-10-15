// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('User', UserSchema);
