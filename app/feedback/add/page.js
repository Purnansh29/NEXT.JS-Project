// app/feedback/add/page.js
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquarePlus, Sparkles, ShieldCheck } from 'lucide-react';
import FeedbackForm from '@/components/feedback/FeedbackForm';

export default function AddFeedbackPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top back navigation */}
      <div>
        <Link
          href="/feedback"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all feedback
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
          <MessageSquarePlus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Add Customer Feedback
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Enter individual customer comments, survey answers, or support tickets.
        </p>
      </div>

      {/* Main Feedback Form */}
      <FeedbackForm />

      {/* Info Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
        <div className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Automatic AI Analysis Ready
            </h4>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              Once submitted, you can run instant sentiment classification, topic extraction, and complaint detection with one click.
            </p>
          </div>
        </div>

        <div className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Privacy & PII Protection
            </h4>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              Personal data like email addresses and phone numbers are automatically sanitized before any AI processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
