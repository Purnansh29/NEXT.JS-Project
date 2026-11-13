// app/reports/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Calendar,
  Trash2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Printer,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, truncate } from '@/lib/utils';

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (res.ok && data.success) {
        setReports(data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/reports');
        const data = await res.json();
        if (res.ok && data.success) {
          setReports(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/reports/${deleteTarget._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete report');
      }
      toast.success('Report deleted successfully');
      setReports((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Saved Executive Reports
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Archive of AI-generated intelligence briefings, customer problem reports, and strategic recommendations.
          </p>
        </div>

        <Link href="/insights">
          <Button size="sm" icon={Sparkles}>
            Generate New Report
          </Button>
        </Link>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No saved reports yet"
          description="Synthesize your first executive report to save it here for presentations, stakeholders, or technical reviews."
          actionLabel="Generate Report"
          onAction={() => router.push('/insights')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((report) => (
            <div
              key={report._id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {report.title}
                  </h3>
                  <button
                    onClick={() => setDeleteTarget(report)}
                    className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                    title="Delete report"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(report.createdAt)}
                  </span>
                  <span>•</span>
                  <span>{report.feedbackCount || 0} feedback analyzed</span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                  {report.summary}
                </p>
              </div>

              {/* Highlights pills & link */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <span className="text-[11px] text-zinc-500 font-medium">
                  {report.keyIssues?.length || 0} issues • {report.suggestions?.length || 0} actions
                </span>

                <Link
                  href={`/reports/${report._id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  View Full Report
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Saved Report"
        description="Are you sure you want to permanently delete this report? This cannot be undone."
      >
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
    </div>
  );
}
