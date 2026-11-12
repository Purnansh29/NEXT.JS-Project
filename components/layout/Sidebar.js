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
  BarChart3,
  Layers,
  ChevronRight,
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
          badge: null,
        },
      ],
    },
    {
      name: 'Feedback',
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
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-zinc-900 text-zinc-100 transition-transform duration-200 ease-in-out dark:border-zinc-800 dark:bg-black lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800/80 px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white">
                Feedback<span className="text-indigo-400">AI</span>
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400">
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
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  {group.name}
                </p>
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/feedback'
                      ? pathname === '/feedback'
                      : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => onClose && onClose()}
                      className={cn(
                        'group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-indigo-600/15 text-indigo-400 shadow-sm border border-indigo-500/20'
                          : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            'h-4 w-4 transition-colors',
                            isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200',
                            item.highlight && !isActive && 'text-purple-400'
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.highlight && (
                        <span className="rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300">
                          AI
                        </span>
                      )}
                      {isActive && <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Status / Workspace info at bottom */}
        <div className="border-t border-zinc-800/80 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-800/40 p-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex-1 truncate">
              <p className="text-xs font-medium text-zinc-200">Gemini 1.5 Flash</p>
              <p className="text-[10px] text-zinc-400">AI Engine Ready</p>
            </div>
            <span className="rounded bg-zinc-700/60 px-1.5 py-0.5 text-[10px] text-zinc-300">
              v1.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
