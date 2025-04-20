const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/elderlycare';
const PORT = 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, PORT };
