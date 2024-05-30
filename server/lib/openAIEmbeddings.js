// server/lib/openAI.js
require('dotenv').config({ path: '/Users/jonahblack/Blitz-App/.env' });
const express = require('express');
const OpenAI = require('openai').OpenAI;

// Initialize the OpenAI client with your API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const normalizeL2 = (x) => {
  const norm = Math.sqrt(x.reduce((acc, val) => acc + val * val, 0));
  return x.map(val => val / norm);
};

// Function to fetch and log the embedding, accepts text input as a parameter
async function getEmbedding(text, model = 'text-embedding-3-small') {
  try {
    // text = text.replace('\n', ' ');
    const response = await client.embeddings.create({
      input: [text],
      model: model,
    });
    let embeddings = response.data[0].embedding;
    embeddings = normalizeL2(embeddings); // Normalize the embeddings
    return embeddings;
    /*return response.data[0].embedding;*/
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

module.exports = { getEmbedding }; 



