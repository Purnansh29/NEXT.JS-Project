// components/layout/Header.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Plus,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Button from '../ui/Button';

export default function Header({ onOpenSidebar }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/feedback?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6 transition-colors">
      {/* Left side: Hamburger on mobile + Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search feedback, topics, complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-slate-100/70 py-1.5 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:bg-zinc-900"
          />
        </form>
      </div>

      {/* Right side: Theme Toggle & Quick Add CTA */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Modern Theme Switcher Pill */}
        <button
          onClick={toggleTheme}
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/60 text-slate-700 transition-all hover:bg-slate-200 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Quick Add CTA */}
        <Link href="/feedback/add">
          <Button size="sm" icon={Plus} className="hidden sm:inline-flex shadow-sm">
            Add Feedback
          </Button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white sm:hidden shadow-sm"
            title="Add Feedback"
          >
            <Plus className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </header>
  );
}
