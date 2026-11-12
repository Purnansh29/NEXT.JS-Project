// models/Report.js
// Mongoose schema for AI-generated business insight reports

import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    // User-defined title for the report
    title: {
      type: String,
      required: [true, 'Report title is required'],
      minlength: [3, 'Title must be at least 3 characters'],
      trim: true,
    },

    // Optional date range the report covers
    dateRange: {
      from: { type: Date, default: null },
      to: { type: Date, default: null },
    },

    // AI-generated executive summary paragraph
    summary: {
      type: String,
      required: true,
    },

    // e.g., ["Delivery delays are most common complaint", "Support response time issues"]
    keyIssues: {
      type: [String],
      default: [],
    },

    // e.g., ["Customers love product quality", "Pricing is well-received"]
    positiveObservations: {
      type: [String],
      default: [],
    },

    // e.g., ["Improve delivery SLA", "Add more support agents"]
    suggestions: {
      type: [String],
      default: [],
    },

    // e.g., ["Negative sentiment increasing in last 7 days"]
    trends: {
      type: [String],
      default: [],
    },

    // How many feedback entries were analyzed to generate this report
    feedbackCount: {
      type: Number,
      default: 0,
    },

    // Snapshot of sentiment counts at time of report generation
    sentimentBreakdown: {
      positive: { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
