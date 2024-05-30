require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupsRoutes');
const taskRoutes = require('./routes/tasksRoutes');
const matchmakingRoutes = require('./routes/matchmakingRoutes');
const { getEmbedding } = require('./lib/openAIEmbeddings');
const { getUserGroups } = require('./controllers/groupController');
// const testRoute = require('./testRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:3001' })); // Allow requests from the client running on port 3001

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
// app.use('/api', testRoute);

// Define specific routes explicitly to avoid conflicts
app.get('/api/groups/:userId', getUserGroups);

// For general group routes
app.use('/api/groups', groupRoutes);

app.post('/api/blitz/get-embeddings', async (req, res) => {
    try {
        const text = req.body.text;
        if (!text) {
            return res.status(400).send('Text is required');
        }
        const embeddings = await getEmbedding(text); // Ensure this function is correctly implemented
        res.json({ embeddings });
    } catch (error) {
        console.error('Failed to get embeddings:', error.message);
        res.status(500).send(error.message);
    }
});

// catchall handler: any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

