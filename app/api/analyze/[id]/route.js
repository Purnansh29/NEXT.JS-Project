// app/api/analyze/[id]/route.js
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { callGemini } from '@/lib/gemini';
import { getSentimentPrompt } from '@/lib/prompts';
import { sanitizeForAI, validateAIResponse } from '@/lib/validators';
import mongoose from 'mongoose';

/**
 * POST /api/analyze/[id]
 * Analyzes a single feedback record using Gemini AI
 */
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: 'Invalid feedback ID format' },
        { status: 400 }
      );
    }

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return Response.json(
        { success: false, error: 'Feedback record not found' },
        { status: 404 }
      );
    }

    // Mark as analyzing
    feedback.analysisStatus = 'analyzing';
    await feedback.save();

    try {
      const sanitizedText = sanitizeForAI(feedback.feedbackText);
      const prompt = getSentimentPrompt(sanitizedText);
      const aiResult = await callGemini(prompt, sanitizedText);

      // Validate AI output
      const validation = validateAIResponse(aiResult);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('; '));
      }

      // Update feedback with AI results
      feedback.sentiment = aiResult.sentiment.toLowerCase();
      feedback.confidenceScore = aiResult.confidenceScore;
      feedback.explanation = aiResult.explanation;
      feedback.topics = aiResult.topics || [];
      feedback.positiveObservations = aiResult.positiveObservations || [];
      feedback.complaints = aiResult.complaints || [];
      feedback.analysisStatus = 'completed';

      await feedback.save();

      return Response.json({
        success: true,
        message: 'Feedback analyzed successfully',
        data: feedback,
      });
    } catch (aiErr) {
      console.error('AI analysis error for ID', id, aiErr);
      feedback.analysisStatus = 'failed';
      await feedback.save();

      return Response.json(
        {
          success: false,
          error: 'AI analysis failed: ' + aiErr.message,
          data: feedback,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error in /api/analyze/[id]:', error);
    return Response.json(
      { success: false, error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
