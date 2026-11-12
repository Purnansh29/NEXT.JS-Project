// app/api/feedback/[id]/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import mongoose from 'mongoose';

/**
 * GET /api/feedback/[id]
 * Fetch single feedback record by ID
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: 'Invalid feedback ID format' },
        { status: 400 }
      );
    }

    const feedback = await Feedback.findById(id).lean();

    if (!feedback) {
      return Response.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Error fetching feedback by ID:', error);
    return Response.json(
      { success: false, error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/feedback/[id]
 * Update an existing feedback record
 */
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: 'Invalid feedback ID format' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (body.feedbackText) updateData.feedbackText = body.feedbackText.trim();
    if (body.source) updateData.source = body.source.toLowerCase();
    if (body.rating !== undefined) updateData.rating = body.rating ? Number(body.rating) : null;
    if (body.submissionDate) updateData.submissionDate = new Date(body.submissionDate);

    const updated = await Feedback.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return Response.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Feedback updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return Response.json(
      { success: false, error: 'Failed to update feedback: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/feedback/[id]
 * Delete a feedback record
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: 'Invalid feedback ID format' },
        { status: 400 }
      );
    }

    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Feedback deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return Response.json(
      { success: false, error: 'Failed to delete feedback: ' + error.message },
      { status: 500 }
    );
  }
}
