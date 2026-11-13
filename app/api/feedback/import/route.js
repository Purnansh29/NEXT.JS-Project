// app/api/feedback/import/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

/**
 * Case-insensitive value finder for CSV object keys
 */
function getColumnValue(row, pattern) {
  const matchingKey = Object.keys(row).find((k) => pattern.test(k.trim()));
  return matchingKey !== undefined ? row[matchingKey] : undefined;
}

/**
 * Normalizes different incoming channel names to our standard enum
 */
function normalizeSource(raw) {
  if (!raw) return 'manual';
  const s = raw.toString().toLowerCase().trim();

  if (s.includes('email') || s.includes('mail')) return 'email';
  if (s.includes('chat') || s.includes('intercom') || s.includes('zendesk') || s.includes('slack')) return 'chat';
  if (s.includes('survey') || s.includes('form') || s.includes('typeform') || s.includes('poll')) return 'survey';
  if (s.includes('social') || s.includes('twitter') || s.includes('x') || s.includes('facebook') || s.includes('instagram') || s.includes('review') || s.includes('google')) return 'social';
  if (s.includes('manual') || s.includes('direct') || s.includes('internal')) return 'manual';

  return 'other';
}

/**
 * POST /api/feedback/import
 * Bulk imports parsed feedback rows into MongoDB with case-insensitive column mapping
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

    if (rows.length > 2000) {
      return Response.json(
        { success: false, error: 'Maximum batch size is 2,000 rows per import.' },
        { status: 400 }
      );
    }

    const validRows = [];
    const skippedRows = [];

    rows.forEach((row, index) => {
      // Find feedback text case-insensitively
      const rawText = getColumnValue(row, /^(feedback|feedbacktext|text|comment|comments|review|reviews|message|description)$/i)
        || getColumnValue(row, /feedback|comment|review/i)
        || Object.values(row).find(val => typeof val === 'string' && val.trim().length >= 10);

      if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 5) {
        skippedRows.push({
          row: index + 1,
          reason: 'Feedback text is missing or too short (< 5 characters)',
        });
        return;
      }

      // Find source / channel case-insensitively
      const rawSource = getColumnValue(row, /^(source|channel|platform|via|type)$/i);
      const source = normalizeSource(rawSource);

      // Find rating (1 - 5) case-insensitively
      let rating = null;
      const rawRating = getColumnValue(row, /^(rating|rate|stars|score)$/i);
      if (rawRating !== undefined && rawRating !== null && rawRating !== '') {
        const num = Number(rawRating);
        if (!isNaN(num) && num >= 1 && num <= 5) {
          rating = Math.round(num);
        }
      }

      // Find submission date case-insensitively
      let submissionDate = new Date();
      const rawDate = getColumnValue(row, /^(date|submissiondate|submitted|created|timestamp|createdat)$/i);
      if (rawDate) {
        const parsedDate = new Date(rawDate);
        if (!isNaN(parsedDate.getTime())) {
          submissionDate = parsedDate;
        }
      }

      validRows.push({
        feedbackText: rawText.trim().substring(0, 5000),
        source,
        rating,
        submissionDate,
        analysisStatus: 'pending',
      });
    });

    if (validRows.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'No valid rows found in the CSV. Ensure there is a column containing customer feedback text.',
          skipped: skippedRows,
        },
        { status: 400 }
      );
    }

    // Insert valid records into MongoDB
    const inserted = await Feedback.insertMany(validRows, { ordered: false });

    return Response.json({
      success: true,
      message: `Successfully imported ${inserted.length} feedback records!`,
      importedCount: inserted.length,
      skippedCount: skippedRows.length,
      skippedDetails: skippedRows.slice(0, 10),
    });
  } catch (error) {
    console.error('CSV import error:', error);
    return Response.json(
      { success: false, error: 'Failed to import feedback rows: ' + error.message },
      { status: 500 }
    );
  }
}
