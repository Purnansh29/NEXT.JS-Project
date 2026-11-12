// app/feedback/page.js
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plus,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import FilterBar from '@/components/feedback/FilterBar';
import FeedbackTable from '@/components/feedback/FeedbackTable';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

export default function FeedbackPage() {
  const {
    feedbacks,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    refresh,
    deleteFeedback,
  } = useFeedback();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Customer Feedback
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Manage, filter, search, and analyze customer feedback from all channels.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={refresh}
            title="Refresh List"
          />
          <Link href="/feedback/import">
            <Button variant="outline" size="sm" icon={Upload}>
              Import CSV
            </Button>
          </Link>
          <Link href="/feedback/add">
            <Button size="sm" icon={Plus}>
              Add Feedback
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar filters={filters} onFilterChange={updateFilters} />

      {/* Error state if API call failed */}
      {error ? (
        <ErrorState
          title="Could not load feedback"
          description={error}
          onRetry={refresh}
        />
      ) : (
        /* Feedback Data Table */
        <div className="space-y-4">
          <FeedbackTable
            feedbacks={feedbacks}
            loading={loading}
            onDelete={deleteFeedback}
            onAnalyze={refresh}
          />

          {/* Pagination Controls */}
          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 text-xs text-zinc-500 dark:text-zinc-400">
              <p>
                Showing{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                  {pagination.total}
                </span>{' '}
                feedback records
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronLeft}
                  disabled={pagination.page <= 1}
                  onClick={() => updateFilters({ page: pagination.page - 1 })}
                >
                  Previous
                </Button>
                <span className="px-2 font-medium text-zinc-700 dark:text-zinc-300">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => updateFilters({ page: pagination.page + 1 })}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
