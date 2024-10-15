// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To handle JSON payloads

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Import Routes
const userRoutes = require('./routes/users');           // Import user routes
const transactionRoutes = require('./routes/transactions'); // Import transaction routes

// Use Routes
app.use('/api/users', userRoutes);              // Users API endpoint
app.use('/api/transactions', transactionRoutes); // Transactions API endpoint

// Sample Route
app.get('/', (req, res) => {
  res.send('Voice Bank Assistant Backend');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
