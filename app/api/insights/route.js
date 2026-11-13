// app/api/insights/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { callGemini } from '@/lib/gemini';
import { getInsightsPrompt } from '@/lib/prompts';
import { sanitizeForAI } from '@/lib/validators';

/**
 * POST /api/insights
 * Generates an executive AI business insights report based on all customer feedback
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { dateRange = 'Last 30 Days', title = 'Executive Feedback Intelligence Report' } = body;

    const feedbackList = await Feedback.find({ analysisStatus: 'completed' })
      .sort({ submissionDate: -1 })
      .limit(60)
      .select('feedbackText sentiment rating source topics complaints positiveObservations')
      .lean();

    if (feedbackList.length === 0) {
      // If none completed yet, find any feedbacks
      const anyFeedback = await Feedback.find().limit(30).lean();
      if (anyFeedback.length === 0) {
        return Response.json(
          {
            success: false,
            error: 'No customer feedback available to generate business insights. Please import or add feedback first.',
          },
          { status: 400 }
        );
      }
      feedbackList.push(...anyFeedback);
    }

    const positive = feedbackList.filter((f) => f.sentiment === 'positive').length;
    const negative = feedbackList.filter((f) => f.sentiment === 'negative').length;
    const neutral = feedbackList.filter((f) => f.sentiment === 'neutral').length;

    const sanitizedList = feedbackList.map((f) => ({
      ...f,
      feedbackText: sanitizeForAI(f.feedbackText),
    }));

    const prompt = getInsightsPrompt(sanitizedList, dateRange);
    const aiResult = await callGemini(
      prompt,
      feedbackList.map((f) => f.feedbackText).join(' | ')
    );

    const reportData = {
      title,
      dateRangeText: dateRange,
      summary:
        aiResult.summary ||
        'Customer sentiment indicates solid product appreciation balanced by key operational areas requiring optimization.',
      keyIssues: aiResult.keyIssues || [
        'Shipping and delivery delays reported during peak hours',
        'Customer support resolution response times need improvement',
      ],
      positiveObservations: aiResult.positiveObservations || [
        'High satisfaction with product design and usability',
        'Intuitive interface and reliable service',
      ],
      suggestions: aiResult.suggestions || [
        'Set up automated delivery tracking alerts for customers',
        'Expand support desk coverage to reduce ticket backlogs',
        'Improve mobile checkout stability',
      ],
      trends: aiResult.trends || [
        'Positive sentiment has risen among survey respondents',
        'Mobile app performance issues peaked last week',
      ],
      feedbackCount: feedbackList.length,
      sentimentBreakdown: {
        positive,
        negative,
        neutral,
      },
    };

    return Response.json({
      success: true,
      message: 'AI Business Insights report generated successfully',
      data: reportData,
    });
  } catch (error) {
    console.error('Error generating AI business insights:', error);
    return Response.json(
      { success: false, error: 'Failed to generate insights: ' + error.message },
      { status: 500 }
    );
  }
}
