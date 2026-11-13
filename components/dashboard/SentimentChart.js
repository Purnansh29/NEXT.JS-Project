// components/dashboard/SentimentChart.js
'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

export default function SentimentChart({ sentiment = {}, channels = {} }) {
  const data = [
    { name: 'Positive', value: sentiment.positive || 0, color: '#10b981' },
    { name: 'Neutral', value: sentiment.neutral || 0, color: '#f59e0b' },
    { name: 'Negative', value: sentiment.negative || 0, color: '#f43f5e' },
  ].filter((d) => d.value > 0);

  const total = (sentiment.positive || 0) + (sentiment.neutral || 0) + (sentiment.negative || 0);

  const channelList = [
    { name: 'Email', count: channels.email || 0, color: '#3b82f6' },
    { name: 'Live Chat', count: channels.chat || 0, color: '#8b5cf6' },
    { name: 'Surveys', count: channels.survey || 0, color: '#10b981' },
    { name: 'Social Media', count: channels.social || 0, color: '#ec4899' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
      {/* Left: Donut Chart */}
      <div className="relative h-64 w-full flex items-center justify-center">
        {total > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} (${Math.round((val / total) * 100)}%)`, name]}
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderRadius: '12px',
                    border: '1px solid #27272a',
                    fontSize: '12px',
                    color: '#fafafa',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{total}</span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">Total Analyzed</span>
            </div>
          </>
        ) : (
          <div className="text-xs text-zinc-400 text-center">
            No analyzed feedback yet.<br />Run AI analysis to see sentiment breakdown.
          </div>
        )}
      </div>

      {/* Right: Channel Breakdown Bars */}
      <div className="space-y-3.5 pr-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Distribution by Channel
        </p>
        {channelList.map((ch) => {
          const pct = total > 0 ? Math.min(100, Math.round((ch.count / (total || 1)) * 100)) : 0;

          return (
            <div key={ch.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{ch.name}</span>
                <span className="text-zinc-500 font-mono text-[11px]">{ch.count} entries</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, pct)}%`, backgroundColor: ch.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
