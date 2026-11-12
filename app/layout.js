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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
