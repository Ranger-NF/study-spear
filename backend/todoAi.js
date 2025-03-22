const express = require('express');
var fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDb } = require('./config/db')

dotenv.config();

var onboardingQuestions = JSON.parse(fs.readFileSync('questions.json', 'utf8')).onboarding;

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
connectDB();

app.get('/api/questions', (req, res) => {
  res.json(onboardingQuestions);
});

app.post('/api/answers', (req, res) => {
    req.body
    res.json({ message: 'Data from the backend' });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});