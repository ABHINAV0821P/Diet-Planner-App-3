// Centralized configuration for the Gemini API

// From your list of available models, 'gemini-pro-latest' is a powerful and stable choice.
// If you encounter rate-limiting issues (429 errors), you can easily switch this
// to 'gemini-flash-latest' which is faster and may have a more generous free tier.
const GEMINI_MODEL_NAME = 'gemini-flash-latest';

const API_VERSION = 'v1beta';

const BASE_URL = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${GEMINI_MODEL_NAME}:generateContent`;

module.exports = { BASE_URL };