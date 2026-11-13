// components/layout/AppShell.js
'use client';

import React, { useState, Suspense } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ThemeProvider } from './ThemeProvider';
import ToastProvider from '../ui/Toast';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans antialiased text-slate-900 dark:text-zinc-100 transition-colors duration-200">
        <ToastProvider />
        {/* Sidebar inside Suspense for usePathname */}
        <Suspense fallback={<aside className="hidden lg:block w-64 border-r border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />}>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </Suspense>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />}>
            <Header onOpenSidebar={() => setSidebarOpen(true)} />
          </Suspense>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <Suspense fallback={<div className="p-8 text-slate-400 dark:text-zinc-500">Loading...</div>}>
                {children}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
