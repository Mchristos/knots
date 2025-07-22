import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiService from './services/aiService.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.post('/api/ai', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }
  try {
    const aiResponse = await aiService.getKnotSuggestions(query);
    res.json(aiResponse);
  } catch (err) {
    if (err.response) {
      // Axios error from Gemini API
      console.error('[Gemini API Error]', {
        status: err.response.status,
        data: err.response.data
      });
      if (err.response.status === 400) {
        res.status(400).json({ error: 'Gemini API returned 400', details: err.response.data });
        return;
      }
    } else {
      console.error('AI Provider error:', err);
    }
    res.status(500).json({ error: 'AI service failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Knots backend listening on port ${PORT}`);
});
