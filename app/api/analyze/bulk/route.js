// app/api/analyze/bulk/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { callGemini } from '@/lib/gemini';
import { getSentimentPrompt } from '@/lib/prompts';
import { sanitizeForAI, validateAIResponse } from '@/lib/validators';

/**
 * POST /api/analyze/bulk
 * Analyzes multiple pending or failed feedback records in a single batch
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { ids, limit = 20 } = body;

    let query = {};
    if (Array.isArray(ids) && ids.length > 0) {
      query = { _id: { $in: ids } };
    } else {
      query = { analysisStatus: { $in: ['pending', 'failed'] } };
    }

    const itemsToAnalyze = await Feedback.find(query).limit(Math.min(50, limit));

    if (itemsToAnalyze.length === 0) {
      return Response.json({
        success: true,
        message: 'No pending feedback records found to analyze.',
        processedCount: 0,
      });
    }

    let successCount = 0;
    let failedCount = 0;

    for (const item of itemsToAnalyze) {
      try {
        item.analysisStatus = 'analyzing';
        await item.save();

        const sanitizedText = sanitizeForAI(item.feedbackText);
        const prompt = getSentimentPrompt(sanitizedText);
        const aiResult = await callGemini(prompt, sanitizedText);

        const validation = validateAIResponse(aiResult);
        if (!validation.isValid) {
          throw new Error(validation.errors.join('; '));
        }

        item.sentiment = aiResult.sentiment.toLowerCase();
        item.confidenceScore = aiResult.confidenceScore;
        item.explanation = aiResult.explanation;
        item.topics = aiResult.topics || [];
        item.positiveObservations = aiResult.positiveObservations || [];
        item.complaints = aiResult.complaints || [];
        item.analysisStatus = 'completed';

        await item.save();
        successCount++;
      } catch (err) {
        console.error(`Bulk analysis failed for item ${item._id}:`, err.message);
        item.analysisStatus = 'failed';
        await item.save();
        failedCount++;
      }
    }

    const remainingPending = await Feedback.countDocuments({
      analysisStatus: { $in: ['pending', 'failed'] },
    });

    return Response.json({
      success: true,
      message: `Bulk analysis completed: ${successCount} analyzed successfully, ${failedCount} failed.`,
      processedCount: itemsToAnalyze.length,
      successCount,
      failedCount,
      remainingPending,
    });
  } catch (error) {
    console.error('Bulk analysis endpoint error:', error);
    return Response.json(
      { success: false, error: 'Bulk analysis failed: ' + error.message },
      { status: 500 }
    );
  }
}
