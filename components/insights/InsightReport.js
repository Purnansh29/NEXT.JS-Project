// components/insights/InsightReport.js
'use client';

import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  ThumbsUp,
  Lightbulb,
  TrendingUp,
  BookmarkPlus,
  Printer,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

export default function InsightReport({ report, onSaveSuccess, isSavedView = false }) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(isSavedView);

  if (!report) return null;

  const handleSaveReport = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save report');
      }

      setHasSaved(true);
      toast.success('Report saved to your dashboard library!');
      if (onSaveSuccess) onSaveSuccess(data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 print:border-none print:shadow-none print:p-0">
      {/* Report Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <FileText className="h-4 w-4" />
            <span>AI Executive Intelligence Report</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {report.title}
          </h2>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {report.dateRangeText || 'Recent Submissions'}
            </span>
            <span>•</span>
            <span>Synthesized across {report.feedbackCount || 0} feedback entries</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
            title="Print or Save as PDF"
          >
            Export / Print
          </Button>

          {!hasSaved ? (
            <Button
              size="sm"
              icon={BookmarkPlus}
              onClick={handleSaveReport}
              isLoading={isSaving}
            >
              Save Report
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved to Reports
            </span>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 dark:border-indigo-950/60 dark:bg-indigo-950/20 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          Executive Summary
        </h3>
        <p className="text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
          {report.summary}
        </p>
      </div>

      {/* Critical Issues & Positive Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Critical Issues */}
        <div className="space-y-3 rounded-xl border border-rose-200/80 bg-rose-50/30 p-5 dark:border-rose-950 dark:bg-rose-950/10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Core Customer Problems & Issues
          </h3>
          <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
            {report.keyIssues && report.keyIssues.length > 0 ? (
              report.keyIssues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-700 dark:bg-rose-900 dark:text-rose-300">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{issue}</span>
                </li>
              ))
            ) : (
              <li className="italic text-zinc-400">No critical issues detected.</li>
            )}
          </ul>
        </div>

        {/* Positive Observations */}
        <div className="space-y-3 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 dark:border-emerald-950 dark:bg-emerald-950/10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            Customer Satisfaction Strengths
          </h3>
          <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
            {report.positiveObservations && report.positiveObservations.length > 0 ? (
              report.positiveObservations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    ✓
                  </span>
                  <span className="pt-0.5 leading-relaxed">{obs}</span>
                </li>
              ))
            ) : (
              <li className="italic text-zinc-400">No positive strengths recorded.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Suggested Business Improvements */}
      <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Recommended Actionable Improvements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {report.suggestions && report.suggestions.length > 0 ? (
            report.suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950/80 space-y-1"
              >
                <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">
                  Action #{idx + 1}
                </span>
                <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                  {sug}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400 italic">No suggestions available.</p>
          )}
        </div>
      </div>

      {/* Notable Trends & Patterns */}
      {report.trends && report.trends.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            Key Patterns & Market Trends
          </h3>
          <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
            {report.trends.map((t, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
