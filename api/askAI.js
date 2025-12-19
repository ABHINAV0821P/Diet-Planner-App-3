const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/askAI
router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'A prompt is required.' });
  }

  // This feature will use the configured Gemini API
  if (process.env.USE_GEMINI === 'true') {
    try {
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        console.error('Gemini API key is missing.');
        return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing.' });
      }

      console.log('askAI: Received prompt:', prompt);
      // Mask the API key for security in logs
      console.log('askAI: Using Gemini API Key:', `${geminiApiKey.substring(0, 4)}...${geminiApiKey.substring(geminiApiKey.length - 4)}`);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`;

      const response = await axios.post(
        url,
        { contents: [{ parts: [{ text: prompt }] }] },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000, // 30-second timeout
        }
      );

      const text = response.data.candidates[0].content.parts[0].text;
      res.json({ answer: text });
    } catch (err) {
      console.error('Error calling Gemini API for askAI:', err.toJSON ? err.toJSON() : err.message);
      
      const status = err.response ? err.response.status : 500;
      const message = err.response && err.response.data ? err.response.data.error.message : 'Failed to get a response from the AI.';
      const details = err.response ? err.response.data : null;

      res.status(status).json({ error: message, details });
    }
  } else {
    res.status(500).json({ error: 'This feature is currently configured for the Gemini API only.' });
  }
});

module.exports = router;