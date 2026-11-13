// app/insights/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  FileText,
  BookmarkCheck,
  Send,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useFeedback } from '@/hooks/useFeedback';
import SummarizePanel from '@/components/insights/SummarizePanel';
import InsightReport from '@/components/insights/InsightReport';
import TopicGroup from '@/components/insights/TopicGroup';
import Button from '@/components/ui/Button';

export default function InsightsPage() {
  const { topicsData } = useAnalytics();
  const { feedbacks } = useFeedback({ limit: 50 });

  const [reportTitle, setReportTitle] = useState('Monthly Customer Satisfaction Report');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      toast.error('Please enter a report title');
      return;
    }

    try {
      setIsGenerating(true);
      toast.loading('Synthesizing executive AI business insights...', { id: 'insights-gen' });

      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: reportTitle.trim(),
          dateRange,
        }),
      });

      const data = await res.json();
      toast.dismiss('insights-gen');

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate report');
      }

      setCurrentReport(data.data);
      toast.success('Executive report synthesized successfully!');
    } catch (err) {
      toast.dismiss('insights-gen');
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            AI Business Insights
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Generate executive business reports, detect recurring customer complaints, and summarize sentiment trends.
          </p>
        </div>

        <Link href="/reports">
          <Button variant="outline" size="sm" icon={FileText}>
            View Saved Reports Library
          </Button>
        </Link>
      </div>

      {/* Report Generator Control Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            Synthesize New Executive Intelligence Report
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Gemini AI will analyze all customer feedback, extract critical pain points, and draft business recommendations.
          </p>
        </div>

        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              Report Title
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="e.g. Q4 Customer Satisfaction Analysis"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-1/2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Period
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 14 Days">Last 14 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="All Time">All Time</option>
              </select>
            </div>

            <div className="w-1/2 pt-5">
              <Button
                type="submit"
                isLoading={isGenerating}
                icon={isGenerating ? Loader2 : Sparkles}
                className="w-full text-xs h-[38px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                Synthesize
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Generated Report Output (if any) */}
      {currentReport && (
        <InsightReport report={currentReport} />
      )}

      {/* Middle: Instant Feedback Summarizer Panel */}
      <SummarizePanel />

      {/* Bottom: Topic Group Explorer */}
      <TopicGroup topics={topicsData.topics} feedbacks={feedbacks} />
    </div>
  );
}
