// app/api/reports/route.js
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import { validateReport } from '@/lib/validators';

/**
 * GET /api/reports
 * Fetches all saved executive business reports
 */
export async function GET() {
  try {
    await connectDB();
    const reports = await Report.find().sort({ createdAt: -1 }).lean();

    return Response.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch saved reports: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reports
 * Saves an AI-generated business insights report to MongoDB
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const validation = validateReport(body);
    if (!validation.isValid) {
      return Response.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const newReport = await Report.create({
      title: body.title.trim(),
      summary: body.summary,
      keyIssues: body.keyIssues || [],
      positiveObservations: body.positiveObservations || [],
      suggestions: body.suggestions || [],
      trends: body.trends || [],
      feedbackCount: body.feedbackCount || 0,
      sentimentBreakdown: body.sentimentBreakdown || { positive: 0, negative: 0, neutral: 0 },
      dateRange: body.dateRange || {},
    });

    return Response.json(
      {
        success: true,
        message: 'Report saved successfully!',
        data: newReport,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving report:', error);
    return Response.json(
      { success: false, error: 'Failed to save report: ' + error.message },
      { status: 500 }
    );
  }
}
