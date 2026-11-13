// components/insights/TopicGroup.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, MessageSquare, ChevronRight, Star } from 'lucide-react';
import SentimentBadge from '../feedback/SentimentBadge';
import { truncate } from '@/lib/utils';

export default function TopicGroup({ topics = [], feedbacks = [] }) {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]?.name || null);

  const activeTopic = selectedTopic || (topics.length > 0 ? topics[0].name : null);

  const filteredFeedbacks = activeTopic
    ? feedbacks.filter(
        (f) =>
          f.topics &&
          f.topics.some((t) => t.toLowerCase() === activeTopic.toLowerCase())
      )
    : [];

  if (topics.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-zinc-400">
        No topics available yet. Analyze feedback to cluster by topics.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Tag className="h-4 w-4 text-indigo-500" />
          Filter Feedback by Extracted Topic
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Select any theme below to view the original supporting customer comments.
        </p>
      </div>

      {/* Topic Pills Carousel / Wrap */}
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => {
          const isSelected = activeTopic && activeTopic.toLowerCase() === t.name.toLowerCase();

          return (
            <button
              key={t.name}
              type="button"
              onClick={() => setSelectedTopic(t.name)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              <span>#{t.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isSelected ? 'bg-indigo-500 text-white' : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filtered Feedbacks List */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Customer Statements Mentioning #{activeTopic}:
        </span>

        {filteredFeedbacks.length > 0 ? (
          <div className="space-y-2">
            {filteredFeedbacks.slice(0, 5).map((f) => (
              <Link
                key={f._id}
                href={`/feedback/${f._id}`}
                className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 text-xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
              >
                <div className="space-y-1 pr-3">
                  <p className="font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    &quot;{truncate(f.feedbackText, 100)}&quot;
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                    <span className="capitalize">{f.source}</span>
                    {f.rating && (
                      <>
                        <span>•</span>
                        <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-amber-400" />
                          {f.rating}/5
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <SentimentBadge sentiment={f.sentiment} status={f.analysisStatus} />
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 italic py-2">
            No direct matches for this topic.
          </p>
        )}
      </div>
    </div>
  );
}
