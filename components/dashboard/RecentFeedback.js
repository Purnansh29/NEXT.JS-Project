// components/dashboard/RecentFeedback.js
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ExternalLink } from 'lucide-react';
import SentimentBadge from '../feedback/SentimentBadge';
import { formatDate, truncate } from '@/lib/utils';
import Button from '../ui/Button';

export default function RecentFeedback({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-zinc-400">
        No recent feedback entries recorded yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
      {items.slice(0, 5).map((item) => (
        <div
          key={item._id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 px-2 rounded-xl"
        >
          <div className="space-y-1 flex-1 max-w-xl">
            <Link
              href={`/feedback/${item._id}`}
              className="text-xs font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400 line-clamp-1 block"
            >
              &quot;{item.feedbackText}&quot;
            </Link>
            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="capitalize">{item.source || 'manual'}</span>
              <span>•</span>
              <span>{formatDate(item.submissionDate || item.createdAt)}</span>
              {item.rating && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {item.rating}/5
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <SentimentBadge
              sentiment={item.sentiment}
              status={item.analysisStatus}
            />
            <Link href={`/feedback/${item._id}`}>
              <Button variant="ghost" size="sm" icon={ExternalLink} className="h-7 w-7 p-0" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
