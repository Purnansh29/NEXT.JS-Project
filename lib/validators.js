// lib/validators.js
// Input validation functions for API routes

/**
 * Validate feedback input before saving to DB
 */
export function validateFeedback(data) {
  const errors = [];

  if (!data.feedbackText || data.feedbackText.trim().length < 10) {
    errors.push('Feedback text must be at least 10 characters.');
  }

  if (data.feedbackText && data.feedbackText.trim().length > 5000) {
    errors.push('Feedback text must not exceed 5000 characters.');
  }

  const validSources = ['email', 'chat', 'survey', 'social', 'manual', 'other'];
  if (data.source && !validSources.includes(data.source.toLowerCase())) {
    errors.push(`Source must be one of: ${validSources.join(', ')}`);
  }

  if (data.rating !== undefined && data.rating !== null) {
    const rating = Number(data.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push('Rating must be a number between 1 and 5.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate AI analysis response structure
 * Ensures Gemini returned proper JSON format
 */
export function validateAIResponse(data) {
  const errors = [];
  const validSentiments = ['positive', 'negative', 'neutral'];

  if (!data.sentiment || !validSentiments.includes(data.sentiment.toLowerCase())) {
    errors.push('AI must return valid sentiment: positive, negative, or neutral.');
  }

  if (typeof data.confidenceScore !== 'number' || data.confidenceScore < 0 || data.confidenceScore > 1) {
    errors.push('confidenceScore must be a number between 0 and 1.');
  }

  if (!data.explanation || typeof data.explanation !== 'string') {
    errors.push('AI must return an explanation string.');
  }

  if (!Array.isArray(data.topics)) {
    errors.push('topics must be an array.');
  }

  if (!Array.isArray(data.positiveObservations)) {
    errors.push('positiveObservations must be an array.');
  }

  if (!Array.isArray(data.complaints)) {
    errors.push('complaints must be an array.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate report generation request
 */
export function validateReport(data) {
  const errors = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Report title must be at least 3 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize feedback text before sending to AI
 * Removes potential PII patterns (emails, phone numbers)
 */
export function sanitizeForAI(text) {
  return text
    // Remove email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]')
    // Remove phone numbers (basic patterns)
    .replace(/(\+?\d[\d\s\-().]{7,}\d)/g, '[phone]')
    // Trim whitespace
    .trim();
}
