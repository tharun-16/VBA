const mongoose = require('mongoose');
const User = require('./models/User'); // Assuming this is your User model
require('dotenv').config();

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Seed Data
const users = [
  {
    accountNumber: '1234567890',
    name: 'John Doe',
    contactNumber: '9876543210',
    balance: 1000,
  },
  {
    accountNumber: '9876543210',
    name: 'Jane Smith',
    contactNumber: '1234567890',
    balance: 2000,
  },
  // Add more users if needed
];

// Function to seed users
async function seedUsers() {
  try {
    for (const userData of users) {
      const existingUser = await User.findOne({ accountNumber: userData.accountNumber });
      
      if (existingUser) {
        console.log(`User with accountNumber ${userData.accountNumber} already exists. Skipping...`);
      } else {
        const newUser = new User(userData);
        await newUser.save();
        console.log(`User with accountNumber ${userData.accountNumber} created.`);
      }
    }
    console.log('Seeding complete.');
  } catch (err) {
    console.log('Error during seeding:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

seedUsers();
