// components/feedback/FeedbackTable.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Trash2,
  ExternalLink,
  Star,
  Mail,
  MessageSquare,
  ClipboardList,
  Share2,
  PenTool,
  Clock,
  MoreVertical,
} from 'lucide-react';
import SentimentBadge from './SentimentBadge';
import { formatDate, truncate } from '@/lib/utils';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

export default function FeedbackTable({
  feedbacks = [],
  loading = false,
  onDelete,
  onAnalyze,
}) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await onDelete(deleteTarget._id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <EmptyState
        title="No feedback found"
        description="Try adjusting your filters or search term, or add a new customer feedback record."
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 bg-zinc-50/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400">
              <tr>
                <th className="px-5 py-3.5">Customer Feedback</th>
                <th className="px-4 py-3.5">Rating</th>
                <th className="px-4 py-3.5">Channel</th>
                <th className="px-4 py-3.5">Sentiment / Status</th>
                <th className="px-4 py-3.5">Topics</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-800 dark:text-zinc-200">
              {feedbacks.map((item) => (
                <tr
                  key={item._id}
                  className="group transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40"
                >
                  {/* Feedback Text */}
                  <td className="max-w-xs sm:max-w-sm px-5 py-4">
                    <Link
                      href={`/feedback/${item._id}`}
                      className="font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400 transition-colors block"
                    >
                      {truncate(item.feedbackText, 95)}
                    </Link>
                    {item.explanation && (
                      <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                        &quot;{truncate(item.explanation, 80)}&quot;
                      </p>
                    )}
                  </td>

                  {/* Rating Stars */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.rating ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= item.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-zinc-400 text-[11px]">Unrated</span>
                    )}
                  </td>

                  {/* Channel / Source */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-2 py-1 text-[11px] font-medium capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {getSourceIcon(item.source)}
                      {item.source}
                    </span>
                  </td>

                  {/* Sentiment Badge */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <SentimentBadge
                      sentiment={item.sentiment}
                      status={item.analysisStatus}
                    />
                  </td>

                  {/* Extracted Topics */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {item.topics && item.topics.length > 0 ? (
                        item.topics.slice(0, 2).map((topic, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-400 text-[11px]">—</span>
                      )}
                      {item.topics && item.topics.length > 2 && (
                        <span className="text-[10px] text-zinc-400">
                          +{item.topics.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Submission Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-[11px] text-zinc-500 dark:text-zinc-400">
                    {formatDate(item.submissionDate || item.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Details */}
                      <Link href={`/feedback/${item._id}`}>
                        <Button variant="ghost" size="sm" icon={ExternalLink} title="View Details" />
                      </Link>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteTarget(item)}
                        title="Delete Feedback"
                        className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Feedback Record"
        description="Are you sure you want to permanently remove this customer feedback? This action cannot be undone."
      >
        <div className="mt-2 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Feedback Text:
          </p>
          &quot;{deleteTarget && truncate(deleteTarget.feedbackText, 140)}&quot;
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteTarget(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={confirmDelete}
            isLoading={isDeleting}
            icon={Trash2}
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
