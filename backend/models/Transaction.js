// backend/models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdrawal', 'Transfer'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  recipientAccount: {
    type: String,
    required: function () {
      return this.type === 'Transfer'; // Recipient account is required for Transfers
    },
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
