// server/lib/openAITasks.js
require('dotenv').config({ path: '/Users/jonahblack/Blitz-App/.env' });
const OpenAI = require('openai').OpenAI;

// Initialize the OpenAI client with your API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getTaskForGroup = async (interests, location) => {
  const prompt = `
  As a smart assistant, suggest a specific and fun activity for a group in ${location} who are primarily interested in ${interests.join(', ')}. 
  Ensure the activity is engaging, can be done together, and does not require a car. 
  Focus on the most frequent interest from the list. 
  If the activity cannot be done at home, specify a nearby location. 
  Your suggestion should be direct, friendly, and concise—less than one sentence, and no more than 10 words.
  `;

  try {
    const response = await client.chat.completions.create({
        model: 'gpt-4o', // Adjust the model if necessary
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
      });

    const task = response.choices[0].message.content;
    return task;
  } catch (error) {
    console.error('Error generating task:', error);
    throw new Error('Failed to generate task');
  }
};

module.exports = { getTaskForGroup };
