// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get User by Account Number
router.get('/:accountNumber', async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accountNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create User (For Testing)
router.post('/', async (req, res) => {
  const { accountNumber, name, contactNumber, balance } = req.body;

  // Validate incoming data
  if (!accountNumber || !name || !contactNumber || balance === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const user = new User({
    accountNumber,
    name,
    contactNumber,
    balance,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: 'Error creating user: ' + err.message });
  }
});

module.exports = router;
