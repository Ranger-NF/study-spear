import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import logger from './utils/logger.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(logger);
app.use(express.json());

// Routes
app.use('/api/flashcards', flashcardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 