const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️ MONGO_URI is not defined in environment variables. Database connection skipped.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
  }
};

const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isConnected };
