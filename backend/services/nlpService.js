Copy
const natural = require('natural');
const { pipeline } = require('@xenova/transformers');

const tokenizer = new natural.WordTokenizer();

async function generateFlashcards(text) {
  const words = tokenizer.tokenize(text);
  // Implement NER and POS tagging logic here

  const qaPipeline = await pipeline('question-generation');
  const questions = await qaPipeline(text);

  // Combine questions and answers into flashcards
  const flashcards = questions.map(q => ({
    question: q.question,
    answer: q.answer,
  }));

  return flashcards;
}

module.exports = { generateFlashcards };