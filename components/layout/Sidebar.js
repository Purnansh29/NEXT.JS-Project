// components/layout/Sidebar.js
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Upload,
  PlusCircle,
  Sparkles,
  FileText,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Overview',
      items: [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      name: 'Feedback Management',
      items: [
        {
          name: 'All Feedback',
          href: '/feedback',
          icon: MessageSquare,
        },
        {
          name: 'Add Feedback',
          href: '/feedback/add',
          icon: PlusCircle,
        },
        {
          name: 'Import CSV',
          href: '/feedback/import',
          icon: Upload,
        },
      ],
    },
    {
      name: 'AI Intelligence',
      items: [
        {
          name: 'AI Insights',
          href: '/insights',
          icon: Sparkles,
          highlight: true,
        },
        {
          name: 'Saved Reports',
          href: '/reports',
          icon: FileText,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white text-slate-800 transition-transform duration-200 ease-in-out dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-6 dark:border-zinc-800/80">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-slate-900 dark:text-white">
                Feedback<span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Intelligence SaaS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
          <div className="space-y-6">
            {navigation.map((group) => (
              <div key={group.name} className="space-y-1.5">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  {group.name}
                </p>
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/feedback'
                      ? pathname === '/feedback'
                      : pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href));

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => onClose && onClose()}
                      className={cn(
                        'group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/80 shadow-sm dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            'h-4 w-4 transition-colors',
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-400 group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-300',
                            item.highlight && !isActive && 'text-purple-500 dark:text-purple-400'
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.highlight && (
                        <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          AI
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Status / Workspace info at bottom */}
        <div className="border-t border-slate-200/80 p-4 dark:border-zinc-800/80">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Gemini 1.5 Flash</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">AI Engine Ready</p>
            </div>
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
              v1.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
