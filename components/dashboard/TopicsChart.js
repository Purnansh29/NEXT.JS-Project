// components/dashboard/TopicsChart.js
'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export default function TopicsChart({ topics = [], complaints = [] }) {
  const topicData = topics.slice(0, 6);
  const complaintData = complaints.slice(0, 6);

  const getBarColor = (item) => {
    if (item.positive > item.negative) return '#10b981'; // Green
    if (item.negative > item.positive) return '#f43f5e'; // Red
    return '#f59e0b'; // Amber
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Top Discussed Topics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Top Discussed Themes & Topics
          </p>
          <span className="text-[11px] text-zinc-400">Volume</span>
        </div>

        {topicData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topicData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={90}
                  tick={{ fontSize: 11, fill: '#888' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val} mentions (🟢 ${item.payload.positive} | 🔴 ${item.payload.negative})`,
                    'Mentions',
                  ]}
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderRadius: '12px',
                    border: '1px solid #27272a',
                    fontSize: '12px',
                    color: '#fafafa',
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={16}>
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            No topics extracted yet. Run AI analysis on feedback records.
          </div>
        )}
      </div>

      {/* Right: Common Customer Complaints */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Most Common Complaints & Issues
          </p>
          <span className="text-[11px] text-rose-500 font-medium">Issue Frequency</span>
        </div>

        {complaintData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={complaintData}
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis
                  dataKey="text"
                  type="category"
                  width={110}
                  tick={{ fontSize: 10, fill: '#888' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderRadius: '12px',
                    border: '1px solid #27272a',
                    fontSize: '12px',
                    color: '#fafafa',
                  }}
                />
                <Bar dataKey="count" fill="#f43f5e" radius={[0, 8, 8, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            No customer complaints registered yet.
          </div>
        )}
      </div>
    </div>
  );
}
