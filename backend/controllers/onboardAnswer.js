import User from '../models/User.js';
import Groq from 'groq-sdk';
import fs from 'fs';

// Debug logging
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not defined in environment variables');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const onboardingQuestions = JSON.parse(fs.readFileSync('questions.json', 'utf8')).onboarding;

const processAnswers = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.userId;

    // Format answers for Groq AI
    const formattedAnswers = answers.map(qa => 
      `Q: ${qa.question}\nA: ${qa.answer}`
    ).join('\n\n');

    // Create prompt for Groq AI
    const prompt = `Extract one-word or hyphenated descriptive traits directly from the user's answers, focusing on their productivity patterns and preferences for timeslot allocation. Do not add assumptions. Return only a comma-separated list of traits. For example, if the user says they are most productive in the morning, return 'morning-productive'.

Answers:
${formattedAnswers}`;

    // Get traits from Groq AI
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    // Parse traits from response
    const traits = completion.choices[0].message.content
      .split(',')
      .map(trait => trait.trim());

    // Update user with traits
    const user = await User.findByIdAndUpdate(
      userId,
      { traits },
      { new: true }
    );

    res.json({
      message: 'Traits successfully analyzed and saved',
      traits: user.traits
    });
  } catch (error) {
    console.error('Error processing answers:', error);
    res.status(500).json({ 
      message: 'Error processing answers', 
      error: error.message 
    });
  }
};

const getQuestions = async (req, res) => {  
  res.json(onboardingQuestions);
}

export { processAnswers, getQuestions };
