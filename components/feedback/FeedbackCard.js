// components/feedback/FeedbackCard.js
'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Mail, MessageSquare, ClipboardList, Share2, PenTool, Calendar, ArrowRight } from 'lucide-react';
import SentimentBadge from './SentimentBadge';
import { formatDate, truncate } from '@/lib/utils';

export default function FeedbackCard({ feedback }) {
  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case 'email':
        return <Mail className="h-3.5 w-3.5 text-blue-500" />;
      case 'chat':
        return <MessageSquare className="h-3.5 w-3.5 text-purple-500" />;
      case 'survey':
        return <ClipboardList className="h-3.5 w-3.5 text-emerald-500" />;
      case 'social':
        return <Share2 className="h-3.5 w-3.5 text-pink-500" />;
      default:
        return <PenTool className="h-3.5 w-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 space-y-3">
      {/* Header: Sentiment + Channel */}
      <div className="flex items-center justify-between">
        <SentimentBadge
          sentiment={feedback.sentiment}
          status={feedback.analysisStatus}
        />
        <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {getSourceIcon(feedback.source)}
          <span className="capitalize">{feedback.source || 'manual'}</span>
        </div>
      </div>

      {/* Body: Feedback Text */}
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-3">
        &quot;{feedback.feedbackText}&quot;
      </p>

      {/* AI Explanation preview if completed */}
      {feedback.explanation && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800 line-clamp-2">
          {feedback.explanation}
        </p>
      )}

      {/* Footer: Rating, Date & Link */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
        <div className="flex items-center gap-2">
          {feedback.rating && (
            <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{feedback.rating}</span>
            </div>
          )}
          <span className="text-zinc-400 text-[11px]">
            {formatDate(feedback.submissionDate || feedback.createdAt)}
          </span>
        </div>

        <Link
          href={`/feedback/${feedback._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          View
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
