// app/layout.js
// Root layout — wraps all pages with sidebar + header
// Will be fully implemented in Phase 1

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FeedbackAI – AI-Powered Customer Feedback Analyzer',
  description: 'Analyze customer feedback using AI. Sentiment analysis, topic extraction, and business insights.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Layout with Sidebar will be added in Phase 1 */}
        {children}
      </body>
    </html>
  );
}
