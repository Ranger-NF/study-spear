require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
import flashcardRoutes from './routes/flashcardRoutes.js';
const authRoutes = require('./routes/authRoutes');
const onboardAnswerRoutes = require('./routes/onboard');
const logger = require('./utils/logger');
const todoRoutes = require('./routes/todoRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use(logger);
app.use(express.json());

// Routes
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardAnswerRoutes);
app.use('/api/todos', todoRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;