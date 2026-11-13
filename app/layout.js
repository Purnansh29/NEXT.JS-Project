// app/layout.js
import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: 'FeedbackAI – AI-Powered Customer Feedback Analyzer',
  description:
    'Production-grade SaaS platform to collect, analyze, and extract deep business intelligence from customer feedback using AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('feedbackai_theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
