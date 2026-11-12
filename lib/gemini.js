// lib/gemini.js
// Google Gemini AI client wrapper
// All AI calls go through this file

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set in environment variables');
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

// Use gemini-1.5-flash (fast and free tier)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Send a prompt to Gemini and get a parsed JSON response
 * @param {string} prompt - The prompt text
 * @returns {object} Parsed JSON response from Gemini
 */
export async function callGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response — remove markdown code blocks if present
    const cleaned = text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse as JSON
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    // If JSON parse fails, throw descriptive error
    if (error instanceof SyntaxError) {
      throw new Error('AI returned an invalid response format. Please try again.');
    }
    throw new Error(`AI API error: ${error.message}`);
  }
}
