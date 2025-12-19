const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/models
router.get('/', async (req, res) => {
  if (process.env.USE_GEMINI !== 'true') {
    return res.status(501).json({ error: 'This feature is only available when USE_GEMINI is true.' });
  }

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('Gemini API key is missing.');
      return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing.' });
    }

    // We use the v1beta endpoint as it often shows the latest available models.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`;
    console.log('listModels: Fetching from URL...');

    const response = await axios.get(url);

    // Filter to only show models that support 'generateContent' for easy debugging.
    const supportedModels = response.data.models
      .filter(model => model.supportedGenerationMethods.includes('generateContent'))
      .map(model => model.name);

    console.log('Successfully fetched models:', supportedModels);
    res.json({ models: supportedModels });
  } catch (err) {
    const status = err.response ? err.response.status : 500;
    const message = err.response?.data?.error?.message || 'Failed to list models from Google API.';
    console.error('Error listing models:', { status, message, details: err.response?.data });
    res.status(status).json({ error: message, details: err.response?.data });
  }
});

module.exports = router;