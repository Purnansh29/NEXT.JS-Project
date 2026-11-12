// components/feedback/SentimentBadge.js
import React from 'react';
import { cn } from '@/lib/utils';
import { Smile, Frown, Meh, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SentimentBadge({ sentiment, status, className = '' }) {
  if (status && status !== 'completed') {
    switch (status) {
      case 'analyzing':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900',
              className
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
            Analyzing...
          </span>
        );
      case 'failed':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900',
              className
            )}
          >
            <AlertTriangle className="h-3 w-3" />
            Failed
          </span>
        );
      case 'pending':
      default:
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900',
              className
            )}
          >
            <Clock className="h-3 w-3" />
            Pending AI
          </span>
        );
    }
  }

  const s = sentiment?.toLowerCase();

  switch (s) {
    case 'positive':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900',
            className
          )}
        >
          <Smile className="h-3.5 w-3.5" />
          Positive
        </span>
      );
    case 'negative':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900',
            className
          )}
        >
          <Frown className="h-3.5 w-3.5" />
          Negative
        </span>
      );
    case 'neutral':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700',
            className
          )}
        >
          <Meh className="h-3.5 w-3.5" />
          Neutral
        </span>
      );
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
            className
          )}
        >
          Unanalyzed
        </span>
      );
  }
}
