// app/feedback/import/page.js
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, FileText, Info } from 'lucide-react';
import CSVImporter from '@/components/feedback/CSVImporter';
import Button from '@/components/ui/Button';

export default function ImportFeedbackPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top back navigation & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all feedback
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Import Customer Feedback
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Upload CSV files exported from Zendesk, Intercom, Google Forms, Typeform, or spreadsheets.
          </p>
        </div>

        {/* Download Sample CSV */}
        <a href="/sample-feedback.csv" download="sample-feedback.csv">
          <Button variant="outline" size="sm" icon={Download}>
            Download Sample CSV
          </Button>
        </a>
      </div>

      {/* Format guidelines */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              Accepted CSV Column Format:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] pt-1">
              <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800 font-mono">
                feedbackText (required)
              </span>
              <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800 font-mono">
                source (email | chat | survey | social | manual)
              </span>
              <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800 font-mono">
                rating (1 to 5)
              </span>
              <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800 font-mono">
                submissionDate (YYYY-MM-DD)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main CSV Importer */}
      <CSVImporter />
    </div>
  );
}
