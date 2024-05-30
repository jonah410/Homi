const BASE_URL = 'http://localhost:3000/api/blitz';

export const getEmbedding = async (text) => {
  try {
    const response = await fetch(`${BASE_URL}/get-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch embeddings');
    }

    const data = await response.json();
    return data.embeddings;
  } catch (error) {
    console.error('Error fetching embeddings:', error);
    return null;
  }
};
