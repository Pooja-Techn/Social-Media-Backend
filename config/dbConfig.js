const mongoose = require('mongoose');
require('dotenv').config();

async function connectMongoDB() {
  const env = process.env.NODE_ENV || 'development';
  const uri =
    env === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected to ${env} database`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

module.exports = connectMongoDB;
