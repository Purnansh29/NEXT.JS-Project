// app/api/feedback/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { validateFeedback } from '@/lib/validators';

/**
 * GET /api/feedback
 * Fetch feedback with search, filter, sorting, and pagination
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const sentiment = searchParams.get('sentiment') || '';
    const source = searchParams.get('source') || '';
    const status = searchParams.get('status') || '';
    const rating = searchParams.get('rating') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    // Build Mongo query object
    const query = {};

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { feedbackText: searchRegex },
        { explanation: searchRegex },
        { topics: searchRegex },
        { complaints: searchRegex },
        { positiveObservations: searchRegex },
      ];
    }

    if (sentiment && sentiment !== 'all') {
      query.sentiment = sentiment.toLowerCase();
    }

    if (source && source !== 'all') {
      query.source = source.toLowerCase();
    }

    if (status && status !== 'all') {
      query.analysisStatus = status.toLowerCase();
    }

    if (rating && rating !== 'all') {
      query.rating = Number(rating);
    }

    // Determine sort order
    let sortOptions = { submissionDate: -1 };
    if (sort === 'oldest') sortOptions = { submissionDate: 1 };
    if (sort === 'rating-high') sortOptions = { rating: -1, submissionDate: -1 };
    if (sort === 'rating-low') sortOptions = { rating: 1, submissionDate: -1 };

    const [feedbacks, total] = await Promise.all([
      Feedback.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Feedback.countDocuments(query),
    ]);

    return Response.json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch feedback records. ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/feedback
 * Create a new feedback record
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate payload
    const validation = validateFeedback(body);
    if (!validation.isValid) {
      return Response.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const newFeedback = await Feedback.create({
      feedbackText: body.feedbackText.trim(),
      source: body.source ? body.source.toLowerCase() : 'manual',
      rating: body.rating ? Number(body.rating) : null,
      submissionDate: body.submissionDate ? new Date(body.submissionDate) : new Date(),
      analysisStatus: 'pending',
    });

    return Response.json(
      {
        success: true,
        message: 'Feedback submitted successfully',
        data: newFeedback,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating feedback:', error);
    return Response.json(
      { success: false, error: 'Failed to save feedback. ' + error.message },
      { status: 500 }
    );
  }
}
