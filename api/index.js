// Express server to serve the AI diet generation endpoint
const express = require('express');
require('dotenv').config(); // Load .env file from the root directory
const bodyParser = require('body-parser');
const cors = require('cors');

const generateDiet = require('./generateDiet');
const askAI = require('./askAI');
const listModels = require('./listModels');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Add a simple logging middleware to see incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
  next();
});

app.use('/api/generateDiet', generateDiet);
app.use('/api/askAI', askAI);
app.use('/api/models', listModels);

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Diet API server running on port ${PORT}`);
});
