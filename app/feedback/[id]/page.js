// app/feedback/[id]/page.js
'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Trash2,
  Edit3,
  Star,
  Calendar,
  Mail,
  MessageSquare,
  ClipboardList,
  Share2,
  PenTool,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Tag,
  Code2,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SentimentBadge from '@/components/feedback/SentimentBadge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { formatDate, formatDateTime, toPercent } from '@/lib/utils';

export default function FeedbackDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  // Edit form state
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editSource, setEditSource] = useState('manual');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchFeedback = useCallback(async () => {
    try {
      const res = await fetch(`/api/feedback/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load feedback details');
      }

      setFeedback(data.data);
      setEditText(data.data.feedbackText || '');
      setEditRating(data.data.rating || 0);
      setEditSource(data.data.source || 'manual');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/feedback/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load feedback details');
        }
        setFeedback(data.data);
        setEditText(data.data.feedbackText || '');
        setEditRating(data.data.rating || 0);
        setEditSource(data.data.source || 'manual');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Run AI Analysis
  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      toast.loading('Analyzing with Gemini AI...', { id: 'analyze-single' });
      const res = await fetch(`/api/analyze/${id}`, { method: 'POST' });
      const data = await res.json();
      toast.dismiss('analyze-single');

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setFeedback(data.data);
      toast.success(
        `AI Analysis Complete: ${data.data.sentiment?.toUpperCase()} (${Math.round(
          (data.data.confidenceScore || 0) * 100
        )}% confidence)`
      );
    } catch (err) {
      toast.dismiss('analyze-single');
      toast.error(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Delete Feedback
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete record');
      }

      toast.success('Feedback deleted successfully');
      router.push('/feedback');
    } catch (err) {
      toast.error(err.message);
      setIsDeleting(false);
    }
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editText.trim() || editText.trim().length < 5) {
      toast.error('Feedback text must be at least 5 characters');
      return;
    }

    try {
      setIsSavingEdit(true);
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackText: editText.trim(),
          rating: editRating > 0 ? editRating : null,
          source: editSource,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update feedback');
      }

      setFeedback(data.data);
      setShowEditModal(false);
      toast.success('Feedback updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'survey':
        return <ClipboardList className="h-4 w-4 text-emerald-500" />;
      case 'social':
        return <Share2 className="h-4 w-4 text-pink-500" />;
      default:
        return <PenTool className="h-4 w-4 text-zinc-400" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="space-y-4">
        <Link
          href="/feedback"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all feedback
        </Link>
        <ErrorState
          title="Feedback Record Not Found"
          description={error || 'The requested feedback does not exist or may have been deleted.'}
          onRetry={fetchFeedback}
        />
      </div>
    );
  }

  const confidencePct = Math.round((feedback.confidenceScore || 0) * 100);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all feedback
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Feedback Record
            </h1>
            <span className="font-mono text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
              #{feedback._id.slice(-6)}
            </span>
            <SentimentBadge
              sentiment={feedback.sentiment}
              status={isAnalyzing ? 'analyzing' : feedback.analysisStatus}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {feedback.analysisStatus !== 'completed' ? (
            <Button
              size="sm"
              icon={isAnalyzing ? Loader2 : Sparkles}
              isLoading={isAnalyzing}
              onClick={handleAnalyze}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              Analyze with AI
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={isAnalyzing ? Loader2 : RotateCw}
              isLoading={isAnalyzing}
              onClick={handleAnalyze}
              title="Re-run AI sentiment classification"
            >
              Re-analyze
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            icon={Edit3}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => setShowDeleteModal(true)}
            className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Feedback Text & Deep Observations */}
        <div className="space-y-6 lg:col-span-2">
          {/* Original Feedback Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Customer Statement
              </span>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDateTime(feedback.submissionDate || feedback.createdAt)}</span>
              </div>
            </div>

            {/* The Text */}
            <blockquote className="text-base sm:text-lg font-medium leading-relaxed text-zinc-900 dark:text-zinc-100 italic">
              &quot;{feedback.feedbackText}&quot;
            </blockquote>

            {/* Meta Tags Footer */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              {/* Channel */}
              <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-2.5 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {getSourceIcon(feedback.source)}
                <span className="font-medium capitalize">{feedback.source}</span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-500 font-medium">
                {feedback.rating ? (
                  <>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= feedback.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-zinc-700 dark:text-zinc-300">
                      ({feedback.rating} / 5 Stars)
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-400">No rating provided</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Explanation Card */}
          {feedback.explanation && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6 dark:border-indigo-900/40 dark:bg-indigo-950/20 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-4 w-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  AI Context & Reasoning
                </h3>
              </div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {feedback.explanation}
              </p>
            </div>
          )}

          {/* Positive Observations & Complaints Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Positive Observations */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 dark:border-emerald-900/30 dark:bg-emerald-950/10 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <ThumbsUp className="h-4 w-4" />
                <span>Positive Highlights</span>
              </div>
              {feedback.positiveObservations && feedback.positiveObservations.length > 0 ? (
                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {feedback.positiveObservations.map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-400 italic">No specific positive points detected.</p>
              )}
            </div>

            {/* Complaints & Issues */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5 dark:border-rose-900/30 dark:bg-rose-950/10 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
                <ThumbsDown className="h-4 w-4" />
                <span>Customer Complaints</span>
              </div>
              {feedback.complaints && feedback.complaints.length > 0 ? (
                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {feedback.complaints.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold mt-0.5">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-400 italic">No direct complaints identified.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): AI Gauge & Extracted Topics */}
        <div className="space-y-6">
          {/* Sentiment & Confidence Gauge Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Sentiment Classification
            </h3>

            <div className="flex items-center justify-between">
              <SentimentBadge
                sentiment={feedback.sentiment}
                status={isAnalyzing ? 'analyzing' : feedback.analysisStatus}
              />
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {feedback.confidenceScore ? `${confidencePct}% confidence` : 'Unrated'}
              </span>
            </div>

            {/* Progress Meter Bar */}
            {feedback.confidenceScore && (
              <div className="space-y-1.5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      feedback.sentiment === 'positive'
                        ? 'bg-emerald-500'
                        : feedback.sentiment === 'negative'
                        ? 'bg-rose-500'
                        : 'bg-zinc-500'
                    }`}
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>

          {/* Extracted Topics Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Tag className="h-4 w-4 text-indigo-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">
                Extracted Topics
              </h3>
            </div>

            {feedback.topics && feedback.topics.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {feedback.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-lg border border-indigo-200 bg-indigo-50/60 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">No topics extracted yet.</p>
            )}
          </div>

          {/* Technical Metadata Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3 text-xs text-zinc-500 dark:text-zinc-400">
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">
              System Metadata
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Database ID:</span>
                <span className="text-zinc-800 dark:text-zinc-200">{feedback._id}</span>
              </div>
              <div className="flex justify-between">
                <span>Analysis Status:</span>
                <span className="text-zinc-800 dark:text-zinc-200 capitalize">
                  {feedback.analysisStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{formatDate(feedback.createdAt)}</span>
              </div>
            </div>

            {/* Toggle Raw JSON */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="flex w-full items-center justify-between text-xs font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
              >
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5" />
                  {showRawJson ? 'Hide Raw Document' : 'View Raw Document'}
                </span>
                {showRawJson ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {showRawJson && (
                <pre className="mt-3 max-h-60 overflow-auto rounded-xl bg-zinc-950 p-3 font-mono text-[10px] text-zinc-300 border border-zinc-800">
                  {JSON.stringify(feedback, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Feedback"
        description="Are you sure you want to delete this feedback record? This action cannot be undone."
      >
        <div className="mt-6 flex justify-end gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            icon={Trash2}
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>

      {/* Edit Feedback Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Feedback Details"
        description="Update the customer feedback text, star rating, or channel."
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Feedback Text
            </label>
            <textarea
              rows={4}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Channel
              </label>
              <select
                value={editSource}
                onChange={(e) => setEditSource(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="email">Email</option>
                <option value="chat">Chat</option>
                <option value="survey">Survey</option>
                <option value="social">Social</option>
                <option value="manual">Manual</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Rating
              </label>
              <select
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="0">No Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" isLoading={isSavingEdit}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
