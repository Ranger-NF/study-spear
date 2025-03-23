import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {connectDB} from './config/db.js';
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import onboardAnswerRoutes from './routes/onboard.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import logger from './utils/logger.js';
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger)

// Routes
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/onboarding', onboardAnswerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


