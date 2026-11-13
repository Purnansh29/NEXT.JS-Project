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

    let query = {};
    if (type === 'positive') {
      // Look for positive sentiment OR 4-5 star ratings
      query = {
        $or: [
          { sentiment: 'positive' },
          { rating: { $gte: 4 } },
        ],
      };
    } else if (type === 'negative') {
      // Look for negative sentiment OR 1-2 star ratings
      query = {
        $or: [
          { sentiment: 'negative' },
          { rating: { $lte: 2, $gt: 0 } },
        ],
      };
    }

    let feedbackList = await Feedback.find(query)
      .sort({ submissionDate: -1 })
      .limit(Math.min(100, limit))
      .select('feedbackText sentiment rating source')
      .lean();

    // If still empty and type is not 'all', try falling back to all feedbacks
    if (feedbackList.length === 0 && type !== 'all') {
      feedbackList = await Feedback.find()
        .sort({ submissionDate: -1 })
        .limit(20)
        .select('feedbackText sentiment rating source')
        .lean();
    }

    if (feedbackList.length === 0) {
      return Response.json(
        {
          success: false,
          error:
            'No feedback found yet. Please go to "All Feedback" and click "Analyze Pending" to classify your records first.',
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
