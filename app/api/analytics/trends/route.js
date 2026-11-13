// app/api/analytics/trends/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

/**
 * GET /api/analytics/trends
 * Aggregates feedback volume and sentiment distribution over the last 14 days
 */
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const daysParam = parseInt(searchParams.get('days') || '14', 10);
    const days = Math.min(60, Math.max(7, daysParam));

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const trendData = await Feedback.aggregate([
      {
        $match: {
          submissionDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$submissionDate' },
          },
          total: { $sum: 1 },
          positive: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] },
          },
          negative: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] },
          },
          neutral: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Create a continuous map of dates
    const dateMap = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const display = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap[key] = {
        dateKey: key,
        displayDate: display,
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0,
      };
    }

    trendData.forEach((item) => {
      if (dateMap[item._id]) {
        dateMap[item._id].positive = item.positive;
        dateMap[item._id].negative = item.negative;
        dateMap[item._id].neutral = item.neutral;
        dateMap[item._id].total = item.total;
      }
    });

    const formattedTrends = Object.values(dateMap);

    return Response.json({
      success: true,
      data: formattedTrends,
    });
  } catch (error) {
    console.error('Error fetching analytics trends:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch trends: ' + error.message },
      { status: 500 }
    );
  }
}
