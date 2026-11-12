// components/feedback/FilterBar.js
'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function FilterBar({ filters, onFilterChange }) {
  const hasActiveFilters =
    filters.search ||
    (filters.sentiment && filters.sentiment !== 'all') ||
    (filters.source && filters.source !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    (filters.rating && filters.rating !== 'all');

  const handleReset = () => {
    onFilterChange({
      search: '',
      sentiment: 'all',
      source: 'all',
      status: 'all',
      rating: 'all',
      sort: 'newest',
    });
  };

  return (
    <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      {/* Top row: Search input + Reset Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search feedback keywords, topics, complaints..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-8 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:bg-zinc-900"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            icon={X}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Bottom row: Filter Select dropdowns */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {/* Sentiment */}
        <select
          value={filters.sentiment || 'all'}
          onChange={(e) => onFilterChange({ sentiment: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-zinc-50/50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
        >
          <option value="all">All Sentiments</option>
          <option value="positive">🟢 Positive</option>
          <option value="negative">🔴 Negative</option>
          <option value="neutral">⚪ Neutral</option>
        </select>

        {/* Source */}
        <select
          value={filters.source || 'all'}
          onChange={(e) => onFilterChange({ source: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-zinc-50/50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
        >
          <option value="all">All Channels</option>
          <option value="email">Email</option>
          <option value="chat">Chat</option>
          <option value="survey">Survey</option>
          <option value="social">Social Media</option>
          <option value="manual">Manual Entry</option>
          <option value="other">Other</option>
        </select>

        {/* Rating */}
        <select
          value={filters.rating || 'all'}
          onChange={(e) => onFilterChange({ rating: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-zinc-50/50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
        >
          <option value="all">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
          <option value="3">⭐⭐⭐ (3 Stars)</option>
          <option value="2">⭐⭐ (2 Stars)</option>
          <option value="1">⭐ (1 Star)</option>
        </select>

        {/* Status */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-zinc-50/50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending AI</option>
          <option value="analyzing">Analyzing</option>
          <option value="failed">Failed</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="col-span-2 sm:col-span-1 rounded-lg border border-zinc-200 bg-zinc-50/50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="rating-high">Sort: Highest Rating</option>
          <option value="rating-low">Sort: Lowest Rating</option>
        </select>
      </div>
    </div>
  );
}
