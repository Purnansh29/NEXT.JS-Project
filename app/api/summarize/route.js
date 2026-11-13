// app/api/summarize/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { callGemini } from '@/lib/gemini';
import { getSummarizationPrompt } from '@/lib/prompts';
import { sanitizeForAI } from '@/lib/validators';

/**
 * POST /api/summarize
 * Generates an instant AI summary of customer feedback (all, positive, or negative)
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { type = 'all', limit = 40 } = body;

    const query = {};
    if (type === 'positive') query.sentiment = 'positive';
    if (type === 'negative') query.sentiment = 'negative';

    const feedbackList = await Feedback.find(query)
      .sort({ submissionDate: -1 })
      .limit(Math.min(100, limit))
      .select('feedbackText sentiment rating source')
      .lean();

    if (feedbackList.length === 0) {
      return Response.json(
        {
          success: false,
          error: `No ${type !== 'all' ? type : ''} feedback records found to summarize.`,
        },
        { status: 400 }
      );
    }

    const sanitizedList = feedbackList.map((f) => ({
      ...f,
      feedbackText: sanitizeForAI(f.feedbackText),
    }));

    const prompt = getSummarizationPrompt(sanitizedList, type);
    const aiResult = await callGemini(prompt, feedbackList.map((f) => f.feedbackText).join('\n'));

    return Response.json({
      success: true,
      data: {
        type,
        feedbackCount: feedbackList.length,
        summary: aiResult.summary || 'Summary generated from customer feedback.',
        commonComplaints: aiResult.commonComplaints || [],
        positiveExperiences: aiResult.positiveExperiences || [],
        keyThemes: aiResult.keyThemes || [],
      },
    });
  } catch (error) {
    console.error('Error generating feedback summary:', error);
    return Response.json(
      { success: false, error: 'Failed to generate summary: ' + error.message },
      { status: 500 }
    );
  }
}
