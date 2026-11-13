// app/reports/[id]/page.js
'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import InsightReport from '@/components/insights/InsightReport';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export default function ReportDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/reports/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Report not found');
        }

        setReport(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this saved report?')) return;
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete report');
      }
      toast.success('Report deleted');
      router.push('/reports');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-4">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all reports
        </Link>
        <ErrorState
          title="Report Not Found"
          description={error || 'This saved report may have been deleted.'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to saved reports library
        </Link>

        <Button
          variant="ghost"
          size="sm"
          icon={Trash2}
          onClick={handleDelete}
          className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          Delete Report
        </Button>
      </div>

      <InsightReport report={report} isSavedView={true} />
    </div>
  );
}
