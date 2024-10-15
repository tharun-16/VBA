// backend/routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Create a Transaction
router.post('/', async (req, res) => {
  const { accountNumber, type, amount, recipientAccount } = req.body;

  try {
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (type === 'Withdrawal' || type === 'Transfer') {
      if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
    }

    // Update User Balance
    if (type === 'Deposit') {
      user.balance += amount;
    } else if (type === 'Withdrawal') {
      user.balance -= amount;
    } else if (type === 'Transfer') {
      user.balance -= amount;
      const recipient = await User.findOne({ accountNumber: recipientAccount });
      if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
      recipient.balance += amount;
      await recipient.save();
    }

    await user.save();

    // Create Transaction Record
    const transaction = new Transaction({
      accountNumber,
      type,
      amount,
      recipientAccount: type === 'Transfer' ? recipientAccount : undefined,
    });

    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Mini Statement
router.get('/:accountNumber', async (req, res) => {
  try {
    const transactions = await Transaction.find({ accountNumber: req.params.accountNumber })
      .sort({ date: -1 })
      .limit(5);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
