const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const flashcardRoutes = require('./routes/flashcardRoutes');
const logger = require('./utils/logger');

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