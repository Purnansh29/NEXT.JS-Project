// lib/utils.js
// General utility/helper functions used across the app

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind class names safely (handles conflicts)
 * Usage: cn('px-4 py-2', isActive && 'bg-blue-500')
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to readable string
 * Usage: formatDate(new Date()) → "Nov 12, 2026"
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date with time
 * Usage: formatDateTime(new Date()) → "Nov 12, 2026, 10:30 AM"
 */
export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Truncate long text with ellipsis
 * Usage: truncate("long text...", 50)
 */
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get color class based on sentiment
 */
export function getSentimentColor(sentiment) {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'negative':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'neutral':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get status color class based on analysis status
 */
export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'text-green-600 bg-green-50';
    case 'analyzing':
      return 'text-blue-600 bg-blue-50';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'failed':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * Convert confidence score (0-1) to percentage
 * Usage: toPercent(0.87) → "87%"
 */
export function toPercent(score) {
  if (score == null) return 'N/A';
  return `${Math.round(score * 100)}%`;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generate a date range array for analytics
 * Returns last N days as array of date strings
 */
export function getDateRange(days = 30) {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}
