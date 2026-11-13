// lib/gemini.js
// Google Gemini AI client wrapper with JSON enforcement and offline fallback

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
let model = null;

if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenerativeAI client:', err.message);
  }
}

/**
 * Fallback analyzer used when GEMINI_API_KEY is not configured or offline.
 * This guarantees that college demos and local tests work reliably.
 */
function fallbackAnalysis(text) {
  const lower = text.toLowerCase();

  const positiveWords = [
    'great', 'love', 'fast', 'amazing', 'super', 'excellent', 'helpful',
    'good', 'smooth', 'satisfied', 'perfect', 'resolved', 'best', 'quick'
  ];
  const negativeWords = [
    'bad', 'slow', 'crash', 'crashing', 'delay', 'delayed', 'late', 'rude',
    'disappointing', 'terrible', 'unacceptable', 'high', 'poor', 'expensive',
    'broke', 'broken', 'issue', 'failed', 'lost'
  ];

  let posCount = 0;
  let negCount = 0;

  positiveWords.forEach(w => { if (lower.includes(w)) posCount++; });
  negativeWords.forEach(w => { if (lower.includes(w)) negCount++; });

  let sentiment = 'neutral';
  let score = 0.75;
  let explanation = 'Feedback expresses neutral or mixed sentiment.';
  const posObs = [];
  const complaints = [];
  const topics = [];

  if (posCount > negCount) {
    sentiment = 'positive';
    score = Math.min(0.98, 0.70 + posCount * 0.08);
    explanation = 'Customer expresses overall satisfaction and positive experience.';
    posObs.push('Positive impression of service and delivery');
  } else if (negCount > posCount) {
    sentiment = 'negative';
    score = Math.min(0.98, 0.70 + negCount * 0.08);
    explanation = 'Customer highlights frustration or operational shortcomings.';
    complaints.push('Dissatisfaction with performance or support experience');
  }

  // Detect basic topics
  if (/support|service|agent|help|chat/i.test(lower)) topics.push('Customer Support');
  if (/deliver|ship|shipping|speed|delay|time/i.test(lower)) topics.push('Delivery & Shipping');
  if (/price|pricing|cost|expensive|money|refund/i.test(lower)) topics.push('Pricing & Value');
  if (/app|ui|crash|bug|website|checkout/i.test(lower)) topics.push('App & Platform Usability');
  if (/quality|product|packaging|item/i.test(lower)) topics.push('Product Quality');
  if (topics.length === 0) topics.push('General Feedback');

  return {
    sentiment,
    confidenceScore: parseFloat(score.toFixed(2)),
    explanation,
    topics,
    positiveObservations: posObs.length ? posObs : ['Customer engaged with the product'],
    complaints: complaints.length ? complaints : [],
  };
}

/**
 * Send a prompt to Gemini and get a parsed JSON response
 * @param {string} prompt - The prompt text
 * @param {string} fallbackText - Optional raw feedback text for intelligent fallback
 * @returns {object} Parsed JSON response
 */
export async function callGemini(prompt, fallbackText = '') {
  // If no model or API key is set, use fallback directly
  if (!model || !GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.info('Using intelligent fallback analyzer (GEMINI_API_KEY is not configured).');
    return fallbackAnalysis(fallbackText || prompt);
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleaned = text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.warn('Gemini API call failed, using heuristic fallback:', error.message);
    if (fallbackText) {
      return fallbackAnalysis(fallbackText);
    }
    throw new Error(`AI API error: ${error.message}`);
  }
}
