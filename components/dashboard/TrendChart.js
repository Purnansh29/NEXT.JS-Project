// components/dashboard/TrendChart.js
'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-xl backdrop-blur-sm text-xs dark:border-zinc-800 dark:bg-zinc-950/95">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">{label}</p>
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Positive: <span className="font-semibold">{payload[0]?.value || 0}</span>
          </p>
          <p className="flex items-center gap-2 text-amber-500">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Neutral: <span className="font-semibold">{payload[1]?.value || 0}</span>
          </p>
          <p className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Negative: <span className="font-semibold">{payload[2]?.value || 0}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export default function TrendChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-zinc-400">
        No trend data available yet.
      </div>
    );
  }

  return (
    <div className="h-72 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorNeu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 11, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
          />
          <Area
            type="monotone"
            name="Positive"
            dataKey="positive"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorPos)"
          />
          <Area
            type="monotone"
            name="Neutral"
            dataKey="neutral"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorNeu)"
          />
          <Area
            type="monotone"
            name="Negative"
            dataKey="negative"
            stroke="#f43f5e"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorNeg)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
