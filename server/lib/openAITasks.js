// server/lib/openAITasks.js
require('dotenv').config({ path: '/Users/jonahblack/Blitz-App/.env' });
const OpenAI = require('openai').OpenAI;

// Initialize the OpenAI client with your API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getTaskForGroup = async (interests, location) => {
  const prompt = `
    You are a smart assistant. Suggest a fun activity for a group of people who are interested in ${interests.join(', ')} and are currently in ${location}. 
    Make sure the activity is engaging and can be done together, and can be done without a car.
    Be simple and direct, almost forceful with your tone. But keep it friendly.
    Make sure that the content of the activity is based on the interest that appears the most frequently in the list.
    Do not try to accomodate every single interest.
    If the activity cannot be done in someones home, note a location in your response.
    Keep your suggestion less than one sentence, and limit your response to 10 words MAXIMUM.
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
