// components/insights/SummarizePanel.js
'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

export default function SummarizePanel() {
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  const handleGenerateSummary = async (type = filterType) => {
    try {
      setLoading(true);
      setFilterType(type);
      toast.loading(`Summarizing ${type} feedback with AI...`, { id: 'summarize' });

      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, limit: 30 }),
      });

      const data = await res.json();
      toast.dismiss('summarize');

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummaryData(data.data);
      toast.success('Summary generated!');
    } catch (err) {
      toast.dismiss('summarize');
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 space-y-5">
      {/* Top Header & Type Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Instant Feedback Summarizer
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Synthesize key takeaways across customer feedback with one click.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80 self-start sm:self-center">
          <button
            type="button"
            onClick={() => handleGenerateSummary('all')}
            disabled={loading}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              filterType === 'all'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            All Feedback
          </button>
          <button
            type="button"
            onClick={() => handleGenerateSummary('positive')}
            disabled={loading}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              filterType === 'positive'
                ? 'bg-white text-emerald-600 shadow-sm dark:bg-zinc-900 dark:text-emerald-400'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            🟢 Positive Only
          </button>
          <button
            type="button"
            onClick={() => handleGenerateSummary('negative')}
            disabled={loading}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              filterType === 'negative'
                ? 'bg-white text-rose-600 shadow-sm dark:bg-zinc-900 dark:text-rose-400'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            🔴 Negative Only
          </button>
        </div>
      </div>

      {/* Summary Content Body */}
      {loading ? (
        <div className="flex min-h-[160px] flex-col items-center justify-center space-y-3 py-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <p className="text-xs text-zinc-500 animate-pulse">
            AI is reading and synthesizing {filterType} feedback...
          </p>
        </div>
      ) : summaryData ? (
        <div className="space-y-4">
          {/* Executive Paragraph */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-xs font-medium leading-relaxed text-zinc-800 dark:border-indigo-950 dark:bg-indigo-950/20 dark:text-zinc-200">
            &quot;{summaryData.summary}&quot;
          </div>

          {/* Key Themes & Points Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Key Themes */}
            <div className="rounded-xl border border-zinc-200 p-3.5 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Key Themes
              </span>
              <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                {summaryData.keyThemes.map((theme, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-indigo-500" />
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Positive Experiences */}
            <div className="rounded-xl border border-emerald-200 p-3.5 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ThumbsUp className="h-3.5 w-3.5" />
                What Works Well
              </span>
              <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                {summaryData.positiveExperiences.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Complaints */}
            <div className="rounded-xl border border-rose-200 p-3.5 dark:border-rose-950 bg-rose-50/30 dark:bg-rose-950/20 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <ThumbsDown className="h-3.5 w-3.5" />
                Common Complaints
              </span>
              <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                {summaryData.commonComplaints.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-3">
            Click below to generate a real-time natural language summary of your customer feedback.
          </p>
          <Button
            size="sm"
            onClick={() => handleGenerateSummary('all')}
            icon={Sparkles}
          >
            Generate Instant Summary
          </Button>
        </div>
      )}
    </div>
  );
}
