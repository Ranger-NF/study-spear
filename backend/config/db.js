import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection
 */
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Close MongoDB connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
  }
};

export { connectDB, closeDB };