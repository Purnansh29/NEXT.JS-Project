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
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-900 dark:text-zinc-100">
        <ToastProvider />
        {/* Sidebar inside Suspense for usePathname */}
        <Suspense fallback={<aside className="hidden lg:block w-64 border-r border-zinc-800 bg-black" />}>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </Suspense>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Suspense fallback={<div className="h-16 border-b border-zinc-800 bg-zinc-950" />}>
            <Header onOpenSidebar={() => setSidebarOpen(true)} />
          </Suspense>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <Suspense fallback={<div className="p-8 text-zinc-400">Loading...</div>}>
                {children}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
