// models/Feedback.js
// Mongoose schema for customer feedback + AI analysis results

import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    // ── Core Feedback Fields ──────────────────────────────
    feedbackText: {
      type: String,
      required: [true, 'Feedback text is required'],
      minlength: [10, 'Feedback must be at least 10 characters'],
      maxlength: [5000, 'Feedback cannot exceed 5000 characters'],
      trim: true,
    },

    submissionDate: {
      type: Date,
      default: Date.now,
    },

    source: {
      type: String,
      enum: ['email', 'chat', 'survey', 'social', 'manual', 'other'],
      default: 'manual',
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // ── Analysis Status ───────────────────────────────────
    // pending    → just submitted, not yet analyzed
    // analyzing  → AI call is in progress
    // completed  → AI analysis done and saved
    // failed     → AI call failed, can retry
    analysisStatus: {
      type: String,
      enum: ['pending', 'analyzing', 'completed', 'failed'],
      default: 'pending',
    },

    // ── AI Analysis Results (filled after Gemini call) ────
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral', null],
      default: null,
    },

    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },

    // Short explanation from AI: "Customer is happy about delivery speed"
    explanation: {
      type: String,
      default: null,
    },

    // e.g., ["delivery", "customer support", "pricing"]
    topics: {
      type: [String],
      default: [],
    },

    // e.g., ["Fast shipping", "Friendly support team"]
    positiveObservations: {
      type: [String],
      default: [],
    },

    // e.g., ["Late delivery", "Rude customer service agent"]
    complaints: {
      type: [String],
      default: [],
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Index for faster queries by sentiment and date
FeedbackSchema.index({ sentiment: 1, submissionDate: -1 });
FeedbackSchema.index({ analysisStatus: 1 });
FeedbackSchema.index({ source: 1 });

// Prevent model recompilation during hot reload in dev
export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
