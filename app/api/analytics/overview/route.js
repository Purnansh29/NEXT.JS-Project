// app/api/analytics/overview/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

/**
 * GET /api/analytics/overview
 * Returns high-level metrics for dashboard cards and distribution breakdown
 */
export async function GET() {
  try {
    await connectDB();

    const [
      totalFeedback,
      positiveCount,
      negativeCount,
      neutralCount,
      pendingCount,
      analyzedCount,
      ratingStats,
      channelStats,
    ] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.countDocuments({ sentiment: 'positive' }),
      Feedback.countDocuments({ sentiment: 'negative' }),
      Feedback.countDocuments({ sentiment: 'neutral' }),
      Feedback.countDocuments({ analysisStatus: 'pending' }),
      Feedback.countDocuments({ analysisStatus: 'completed' }),
      Feedback.aggregate([
        { $match: { rating: { $ne: null, $gt: 0 } } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            ratedCount: { $sum: 1 },
          },
        },
      ]),
      Feedback.aggregate([
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const totalAnalyzed = positiveCount + negativeCount + neutralCount;
    const positivePercent = totalAnalyzed > 0 ? Math.round((positiveCount / totalAnalyzed) * 100) : 0;
    const negativePercent = totalAnalyzed > 0 ? Math.round((negativeCount / totalAnalyzed) * 100) : 0;
    const neutralPercent = totalAnalyzed > 0 ? Math.round((neutralCount / totalAnalyzed) * 100) : 0;

    const avgRating = ratingStats.length > 0 && ratingStats[0].avgRating
      ? parseFloat(ratingStats[0].avgRating.toFixed(1))
      : 0;

    const channels = {
      email: 0,
      chat: 0,
      survey: 0,
      social: 0,
      manual: 0,
      other: 0,
    };

    channelStats.forEach((c) => {
      const src = (c._id || 'manual').toLowerCase();
      if (channels[src] !== undefined) {
        channels[src] = c.count;
      } else {
        channels.other = (channels.other || 0) + c.count;
      }
    });

    return Response.json({
      success: true,
      data: {
        totalFeedback,
        analyzedCount,
        pendingCount,
        sentiment: {
          positive: positiveCount,
          negative: negativeCount,
          neutral: neutralCount,
          positivePercent,
          negativePercent,
          neutralPercent,
        },
        rating: {
          average: avgRating,
          totalRated: ratingStats.length > 0 ? ratingStats[0].ratedCount : 0,
        },
        channels,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch overview metrics: ' + error.message },
      { status: 500 }
    );
  }
}
