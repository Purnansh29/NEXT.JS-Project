// app/api/analytics/topics/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

/**
 * GET /api/analytics/topics
 * Aggregates extracted topics, themes, and common complaints across feedback
 */
export async function GET() {
  try {
    await connectDB();

    const [topTopics, topComplaints] = await Promise.all([
      // Top Topics
      Feedback.aggregate([
        { $match: { topics: { $exists: true, $ne: [] } } },
        { $unwind: '$topics' },
        {
          $group: {
            _id: { $toLower: '$topics' },
            topicName: { $first: '$topics' },
            count: { $sum: 1 },
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
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Top Complaints
      Feedback.aggregate([
        { $match: { complaints: { $exists: true, $ne: [] } } },
        { $unwind: '$complaints' },
        {
          $group: {
            _id: { $toLower: '$complaints' },
            complaintText: { $first: '$complaints' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
    ]);

    return Response.json({
      success: true,
      data: {
        topics: topTopics.map((t) => ({
          name: t.topicName,
          count: t.count,
          positive: t.positive,
          negative: t.negative,
          neutral: t.neutral,
        })),
        complaints: topComplaints.map((c) => ({
          text: c.complaintText,
          count: c.count,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching analytics topics:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch topic analysis: ' + error.message },
      { status: 500 }
    );
  }
}
