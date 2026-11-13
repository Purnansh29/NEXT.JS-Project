// components/dashboard/StatsCard.js
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default', // default | positive | negative | neutral | rating
  percentage,
  className = '',
}) {
  const variantStyles = {
    default: {
      card: 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60',
      iconBox: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
      accent: 'text-indigo-600 dark:text-indigo-400',
    },
    positive: {
      card: 'border-emerald-200/80 dark:border-emerald-900/40 bg-white dark:bg-zinc-900/60',
      iconBox: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    negative: {
      card: 'border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-zinc-900/60',
      iconBox: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      accent: 'text-rose-600 dark:text-rose-400',
    },
    neutral: {
      card: 'border-amber-200/80 dark:border-amber-900/40 bg-white dark:bg-zinc-900/60',
      iconBox: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      accent: 'text-amber-600 dark:text-amber-400',
    },
    rating: {
      card: 'border-amber-200/80 dark:border-amber-900/40 bg-white dark:bg-zinc-900/60',
      iconBox: 'bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-400',
      accent: 'text-amber-500',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md',
        style.card,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </span>
        {Icon && (
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', style.iconBox)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {value}
        </span>
        {percentage !== undefined && (
          <span className={cn('text-sm font-semibold', style.accent)}>
            {percentage}%
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
