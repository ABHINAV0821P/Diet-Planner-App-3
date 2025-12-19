// This is a simple Node.js/Express API route for generating a diet plan using OpenAI GPT (or Gemini)
// You must set your API key in the environment variable OPENAI_API_KEY or GEMINI_API_KEY
// To use Gemini, set USE_GEMINI=true in your .env file.

const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/generateDiet
router.post('/', async (req, res) => {
  const { age, weight, height, goal, preference, allergies } = req.body;
  const prompt = `Generate a 7-day ${preference} diet plan for a person who is ${age} years old, weighs ${weight}kg, is ${height}cm tall, wants to ${goal}, and is allergic to ${allergies || 'none'}. Format the response as a valid JSON object. The root object should have keys for each day of the week (e.g., "Monday"). Each day should be an array of objects, where each object represents a meal and has two keys: "meal" (e.g., "Breakfast") and "items" (an array of food item strings). Do not include any text or markdown formatting before or after the JSON object.`;

  if (process.env.USE_GEMINI === 'true') {
    // Gemini API implementation
    try {
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        console.error('Gemini API key is missing. Make sure GEMINI_API_KEY is set in your .env file.');
        return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing.' });
      }

      console.log('generateDiet: Received prompt:', prompt);
      // Mask the API key for security in logs
      console.log('generateDiet: Using Gemini API Key:', `${geminiApiKey.substring(0, 4)}...${geminiApiKey.substring(geminiApiKey.length - 4)}`);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`;
      const response = await axios.post(
        url,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000, // Wait for 30 seconds before timing out
        }
      );

      // Gemini returns JSON in a slightly different structure
      const text = response.data.candidates[0].content.parts[0].text.replace(/```json\n?|```/g, '');
      let plan;
      try {
        plan = JSON.parse(text);
      } catch {
        plan = { error: 'AI did not return valid JSON', raw: text };
      }
      res.json(plan);
    } catch (err) {
      console.error('Error calling Gemini API for generateDiet:', err.toJSON ? err.toJSON() : err.message);

      const status = err.response ? err.response.status : 500;
      const message = err.response && err.response.data ? err.response.data.error.message : 'Failed to generate diet plan.';
      const details = err.response ? err.response.data : null;

      res.status(status).json({ error: message, details });
    }
  } else {
    // OpenAI API implementation (existing code)
    try {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        console.error('OpenAI API key is missing. Make sure it is set in your .env file.');
        return res.status(500).json({ error: 'Server configuration error: API key is missing.' });
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1200,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const text = response.data.choices[0].message.content.replace(/```json\n?|```/g, '');
      let plan;
      try {
        plan = JSON.parse(text);
      } catch {
        plan = { error: 'AI did not return valid JSON', raw: text };
      }
      res.json(plan);
    } catch (err) {
      console.error('Error calling OpenAI API:', err.response ? err.response.data : err.message);
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
