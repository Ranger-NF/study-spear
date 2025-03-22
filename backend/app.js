require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
// const flashcardRoutes = require('./routes/flashcardRoutes');
const authRoutes = require('./routes/authRoutes');
const onboardAnswerRoutes = require('./routes/onboard');
const logger = require('./utils/logger');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use(logger);
app.use(express.json());

// Routes
// app.use('/api/flashcards', flashcardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardAnswerRoutes);
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 