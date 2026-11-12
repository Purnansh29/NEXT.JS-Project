// components/feedback/FeedbackForm.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Send, ArrowLeft, Mail, MessageSquare, ClipboardList, Share2, PenTool } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

export default function FeedbackForm({ initialData = null, onSuccess }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    feedbackText: initialData?.feedbackText || '',
    source: initialData?.source || 'manual',
    rating: initialData?.rating || 0,
    submissionDate: initialData?.submissionDate
      ? new Date(initialData.submissionDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const sources = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'chat', label: 'Live Chat', icon: MessageSquare },
    { value: 'survey', label: 'Survey', icon: ClipboardList },
    { value: 'social', label: 'Social Media', icon: Share2 },
    { value: 'manual', label: 'Manual Entry', icon: PenTool },
    { value: 'other', label: 'Other', icon: PenTool },
  ];

  const validate = () => {
    const errs = {};
    if (!formData.feedbackText.trim()) {
      errs.feedbackText = 'Customer feedback text is required';
    } else if (formData.feedbackText.trim().length < 10) {
      errs.feedbackText = 'Feedback must be at least 10 characters long';
    } else if (formData.feedbackText.trim().length > 5000) {
      errs.feedbackText = 'Feedback cannot exceed 5000 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const url = initialData?._id ? `/api/feedback/${initialData._id}` : '/api/feedback';
      const method = initialData?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: formData.rating > 0 ? formData.rating : null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.errors?.[0] || 'Failed to save feedback');
      }

      toast.success(
        initialData?._id ? 'Feedback updated successfully!' : 'Feedback added successfully!'
      );

      if (onSuccess) {
        onSuccess(data.data);
      } else {
        router.push('/feedback');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
    >
      {/* Feedback Text Area */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Customer Feedback Text <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-zinc-400">
            {formData.feedbackText.length} / 5000
          </span>
        </div>
        <textarea
          rows={5}
          value={formData.feedbackText}
          onChange={(e) => {
            setFormData({ ...formData, feedbackText: e.target.value });
            if (errors.feedbackText) setErrors({ ...errors, feedbackText: null });
          }}
          placeholder="Paste or type the customer review, support message, or survey response here..."
          className={`w-full rounded-xl border bg-zinc-50/50 p-3.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:bg-white focus:outline-none focus:ring-1 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:bg-zinc-900 ${
            errors.feedbackText
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
              : 'border-zinc-200 focus:border-indigo-600 focus:ring-indigo-600 dark:border-zinc-800'
          }`}
        />
        {errors.feedbackText && (
          <p className="text-xs text-rose-500">{errors.feedbackText}</p>
        )}
      </div>

      {/* Grid: Channel, Rating, Date */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Source / Channel */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Channel / Source
          </label>
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100"
          >
            {sources.map((src) => (
              <option key={src.value} value={src.value}>
                {src.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Stars */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Customer Rating (Optional)
          </label>
          <div className="flex h-[42px] items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    rating: formData.rating === star ? 0 : star,
                  })
                }
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-5 w-5 ${
                    star <= (hoverRating || formData.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-300 dark:text-zinc-600'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-semibold text-zinc-500">
              {formData.rating ? `${formData.rating}/5` : 'None'}
            </span>
          </div>
        </div>

        {/* Submission Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Submission Date
          </label>
          <input
            type="date"
            value={formData.submissionDate}
            onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          variant="outline"
          onClick={() => router.back()}
          type="button"
          icon={ArrowLeft}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={loading} icon={Send}>
          {initialData?._id ? 'Update Feedback' : 'Save Feedback'}
        </Button>
      </div>
    </form>
  );
}
