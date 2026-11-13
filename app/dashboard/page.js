// app/dashboard/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Smile,
  Frown,
  Meh,
  Star,
  MessageSquare,
  Upload,
  Plus,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useFeedback } from '@/hooks/useFeedback';
import StatsCard from '@/components/dashboard/StatsCard';
import TrendChart from '@/components/dashboard/TrendChart';
import SentimentChart from '@/components/dashboard/SentimentChart';
import TopicsChart from '@/components/dashboard/TopicsChart';
import RecentFeedback from '@/components/dashboard/RecentFeedback';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export default function DashboardPage() {
  const [days, setDays] = useState(14);
  const { overview, trends, topicsData, loading, error, refresh } = useAnalytics(days);
  const { feedbacks } = useFeedback({ limit: 5 });

  if (loading && !overview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <ErrorState
        title="Could not load analytics"
        description={error}
        onRetry={refresh}
      />
    );
  }

  const s = overview?.sentiment || { positive: 0, negative: 0, neutral: 0, positivePercent: 0, negativePercent: 0, neutralPercent: 0 };
  const r = overview?.rating || { average: 0, totalRated: 0 };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Analytics Overview
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Real-time sentiment telemetry, customer feedback volume, and AI topic extraction.
          </p>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm focus:border-indigo-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={refresh}
            title="Refresh dashboard"
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

      {/* Top Metric Stats Cards (5-col on desktop) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatsCard
          title="Total Feedback"
          value={overview?.totalFeedback || 0}
          subtitle={`${overview?.analyzedCount || 0} analyzed`}
          icon={MessageSquare}
          variant="default"
        />
        <StatsCard
          title="Positive Sentiment"
          value={s.positive}
          percentage={s.positivePercent}
          subtitle={`${s.positive} customer reviews`}
          icon={Smile}
          variant="positive"
        />
        <StatsCard
          title="Neutral Sentiment"
          value={s.neutral}
          percentage={s.neutralPercent}
          subtitle={`${s.neutral} mixed or neutral`}
          icon={Meh}
          variant="neutral"
        />
        <StatsCard
          title="Negative Sentiment"
          value={s.negative}
          percentage={s.negativePercent}
          subtitle={`${s.negative} issues reported`}
          icon={Frown}
          variant="negative"
        />
        <StatsCard
          title="Avg Rating"
          value={r.average ? `${r.average}` : 'N/A'}
          subtitle={r.totalRated > 0 ? `Across ${r.totalRated} ratings` : 'No ratings yet'}
          icon={Star}
          variant="rating"
        />
      </div>

      {/* Middle Row: Trend Chart & Sentiment / Channel Donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Trend Area Chart */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Sentiment Trends Over Time
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Daily volume split by positive, neutral, and negative sentiment.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">
              Last {days} Days
            </span>
          </div>

          <TrendChart data={trends} />
        </div>

        {/* Sentiment Distribution & Channel Breakdown */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Sentiment & Channel Distribution
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Aggregated feedback breakdown by channel and classified sentiment.
            </p>
          </div>

          <div className="pt-2">
            <SentimentChart
              sentiment={overview?.sentiment}
              channels={overview?.channels}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Topics/Complaints Chart & Recent Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Topics & Complaints (2 Columns wide) */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              Extracted Themes & Complaint Frequency
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Top themes extracted from feedback text alongside common customer complaints.
            </p>
          </div>

          <div className="pt-4">
            <TopicsChart
              topics={topicsData.topics}
              complaints={topicsData.complaints}
            />
          </div>
        </div>

        {/* Recent Feedback Activity (1 Column wide) */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Recent Activity
                </h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Latest customer submissions
                </p>
              </div>
              <Link
                href="/feedback"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 inline-flex items-center gap-1"
              >
                All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-2">
              <RecentFeedback items={feedbacks} />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <Link href="/insights">
              <Button variant="outline" size="sm" icon={Sparkles} className="w-full">
                Generate Full AI Insights Report
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
