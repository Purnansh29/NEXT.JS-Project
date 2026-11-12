// lib/prompts.js
// All AI prompt templates — centralized here so they're easy to update

/**
 * Prompt for analyzing a single feedback entry
 * Returns structured JSON for sentiment, topics, etc.
 */
export function getSentimentPrompt(feedbackText) {
  return `You are a customer feedback analysis AI. Analyze the following customer feedback and return a JSON response ONLY — no extra text, no markdown, no explanation outside the JSON.

Customer Feedback:
"${feedbackText}"

Return this exact JSON structure:
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidenceScore": 0.0 to 1.0,
  "explanation": "One sentence explaining why this sentiment was chosen",
  "topics": ["topic1", "topic2", "topic3"],
  "positiveObservations": ["observation1", "observation2"],
  "complaints": ["complaint1", "complaint2"]
}

Rules:
- sentiment must be exactly "positive", "negative", or "neutral"
- confidenceScore must be a decimal between 0.0 and 1.0
- topics: extract 1-5 specific topics mentioned (e.g., "delivery speed", "customer support", "product quality")
- positiveObservations: list what the customer liked (empty array if none)
- complaints: list specific complaints (empty array if none)
- Focus ONLY on customer feedback analysis. Do not add unrelated information.`;
}

/**
 * Prompt for summarizing a group of feedback entries
 */
export function getSummarizationPrompt(feedbackList, type = 'all') {
  const feedbackText = feedbackList
    .map((f, i) => `${i + 1}. "${f.feedbackText}" (${f.sentiment || 'unanalyzed'})`)
    .join('\n');

  return `You are a customer feedback summarization AI. Summarize the following ${feedbackList.length} customer feedback entries.

Feedback Type Filter: ${type} (all / positive / negative)

Feedback Entries:
${feedbackText}

Return a JSON response ONLY:
{
  "summary": "2-3 sentence overall summary",
  "commonComplaints": ["complaint1", "complaint2"],
  "positiveExperiences": ["positive1", "positive2"],
  "keyThemes": ["theme1", "theme2", "theme3"]
}`;
}

/**
 * Prompt for generating AI business insights report
 */
export function getInsightsPrompt(feedbackList, dateRange) {
  const stats = {
    total: feedbackList.length,
    positive: feedbackList.filter(f => f.sentiment === 'positive').length,
    negative: feedbackList.filter(f => f.sentiment === 'negative').length,
    neutral: feedbackList.filter(f => f.sentiment === 'neutral').length,
  };

  // Collect all complaints and topics
  const allComplaints = feedbackList.flatMap(f => f.complaints || []);
  const allTopics = feedbackList.flatMap(f => f.topics || []);
  const sampleFeedback = feedbackList.slice(0, 20).map(f => f.feedbackText).join(' | ');

  return `You are a business intelligence AI. Generate a comprehensive business insights report based on customer feedback data.

Data Summary:
- Total Feedback Analyzed: ${stats.total}
- Positive: ${stats.positive} (${Math.round((stats.positive/stats.total)*100)}%)
- Negative: ${stats.negative} (${Math.round((stats.negative/stats.total)*100)}%)
- Neutral: ${stats.neutral} (${Math.round((stats.neutral/stats.total)*100)}%)
- Date Range: ${dateRange || 'All time'}

Common Complaints Found: ${allComplaints.slice(0, 20).join(', ')}
Common Topics: ${allTopics.slice(0, 20).join(', ')}
Sample Feedback: ${sampleFeedback.substring(0, 1000)}

Return a JSON response ONLY:
{
  "summary": "Executive summary paragraph (3-4 sentences)",
  "keyIssues": ["Critical issue 1", "Critical issue 2", "Critical issue 3"],
  "positiveObservations": ["What customers love 1", "What customers love 2"],
  "suggestions": ["Actionable improvement 1", "Actionable improvement 2", "Actionable improvement 3"],
  "trends": ["Trend observation 1", "Trend observation 2"]
}`;
}
