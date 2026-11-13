// app/api/reports/[id]/route.js
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import mongoose from 'mongoose';

/**
 * GET /api/reports/[id]
 * Fetch single saved report by ID
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: 'Invalid report ID format' },
        { status: 400 }
      );
    }

    const report = await Report.findById(id).lean();
    if (!report) {
      return Response.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch report: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reports/[id]
 * Delete a saved report by ID
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: 'Invalid report ID format' },
        { status: 400 }
      );
    }

    const deleted = await Report.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Report deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return Response.json(
      { success: false, error: 'Failed to delete report: ' + error.message },
      { status: 500 }
    );
  }
}
