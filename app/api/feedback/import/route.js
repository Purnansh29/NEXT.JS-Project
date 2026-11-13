// app/api/feedback/import/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

/**
 * POST /api/feedback/import
 * Bulk imports parsed feedback rows into MongoDB
 * Expects JSON payload: { rows: [ { feedbackText, source, rating, submissionDate }, ... ] }
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { rows } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return Response.json(
        { success: false, error: 'No feedback rows provided for import.' },
        { status: 400 }
      );
    }

    if (rows.length > 1000) {
      return Response.json(
        { success: false, error: 'Maximum batch size is 1,000 rows per import.' },
        { status: 400 }
      );
    }

    const validSources = ['email', 'chat', 'survey', 'social', 'manual', 'other'];
    const validRows = [];
    const skippedRows = [];

    rows.forEach((row, index) => {
      const text = row.feedbackText || row.text || row.Feedback || row.comment || row.Comment;
      if (!text || typeof text !== 'string' || text.trim().length < 5) {
        skippedRows.push({
          row: index + 1,
          reason: 'Feedback text is missing or too short (< 5 chars)',
        });
        return;
      }

      // Parse source
      let rawSource = (row.source || row.Source || row.channel || row.Channel || 'manual')
        .toString()
        .toLowerCase()
        .trim();
      if (!validSources.includes(rawSource)) {
        rawSource = 'other';
      }

      // Parse rating
      let rating = null;
      const rawRating = row.rating !== undefined ? row.rating : row.Rating;
      if (rawRating !== undefined && rawRating !== null && rawRating !== '') {
        const num = Number(rawRating);
        if (!isNaN(num) && num >= 1 && num <= 5) {
          rating = Math.round(num);
        }
      }

      // Parse date
      let submissionDate = new Date();
      const rawDate = row.submissionDate || row.date || row.Date;
      if (rawDate) {
        const parsedDate = new Date(rawDate);
        if (!isNaN(parsedDate.getTime())) {
          submissionDate = parsedDate;
        }
      }

      validRows.push({
        feedbackText: text.trim().substring(0, 5000),
        source: rawSource,
        rating,
        submissionDate,
        analysisStatus: 'pending',
      });
    });

    if (validRows.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'No valid rows found in the CSV. Ensure there is a column with feedback text.',
          skipped: skippedRows,
        },
        { status: 400 }
      );
    }

    // Insert valid records in bulk
    const inserted = await Feedback.insertMany(validRows, { ordered: false });

    return Response.json({
      success: true,
      message: `Successfully imported ${inserted.length} feedback records.`,
      importedCount: inserted.length,
      skippedCount: skippedRows.length,
      skippedDetails: skippedRows.slice(0, 10), // return top 10 skipped details
    });
  } catch (error) {
    console.error('CSV import error:', error);
    return Response.json(
      { success: false, error: 'Failed to import feedback rows: ' + error.message },
      { status: 500 }
    );
  }
}
