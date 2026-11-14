# FeedbackAI – AI-Powered Customer Feedback Intelligence SaaS

> **A production-ready full-stack SaaS application that transforms unstructured multi-channel customer feedback into actionable business intelligence using Google Gemini AI, Next.js 16 (App Router), MongoDB Atlas, and Tailwind CSS v4.**

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
- [Deployment Guide (Vercel)](#-deployment-guide)
- [MongoDB Atlas Whitelisting Guide](#-mongodb-atlas-whitelisting-guide)
- [Environment Variables](#-environment-variables)
- [API Route Reference](#-api-route-reference)
- [Database Schema](#-database-schema)
- [AI Pipeline & Heuristic Fallback](#-ai-pipeline--heuristic-fallback)
- [College Viva & Technical Interview Guide](#-college-viva--technical-interview-guide)

---

## 🚀 Project Overview

Customer support tickets, product reviews, email feedback, and surveys arrive in high volumes as messy, unstructured text. For product managers, CX leads, and business founders, manually sorting and understanding thousands of customer comments is slow, biased, and labor-intensive.

**FeedbackAI** solves this by providing an end-to-end intelligence platform:
1. **Multi-Channel Ingestion:** Import bulk feedback from CSV or log individual reviews manually.
2. **Automated AI Categorization:** Extracts sentiment (Positive / Neutral / Negative), numerical confidence scores, reasoning explanations, and recurring topic tags using **Google Gemini 1.5 Flash**.
3. **Interactive Telemetry:** Real-time analytics dashboard with sentiment distribution donuts, time-series volume trends, and top customer issue bars.
4. **Executive Insights & Reporting:** One-click summarization of critical pain points and automatic generation of executive business intelligence reports with export-to-PDF capabilities.
5. **Modern SaaS Polish:** Full Light/Dark mode theming, responsive navigation shell, search bar, and optimistic UI updates.

---

## 🏗 System Architecture

```
                  ┌───────────────────────────────┐
                  │          Web Client           │
                  │   Next.js 16 (App Router)     │
                  │   Tailwind CSS v4 + Recharts  │
                  └──────────────┬────────────────┘
                                 │ HTTP (REST)
                                 ▼
                  ┌───────────────────────────────┐
                  │    Next.js Route Handlers     │
                  │        (/api/* endpoints)     │
                  └───────┬───────────────┬───────┘
                          │               │
            MongoDB Native│               │ JSON Prompt & Schema
             Aggregations │               │
                          ▼               ▼
           ┌─────────────────────┐  ┌─────────────────────┐
           │    MongoDB Atlas    │  │  Google Gemini AI   │
           │      (Mongoose)     │  │  (gemini-1.5-flash) │
           │                     │  │                     │
           │  • Feedback Model   │  │  • Sentiment Score  │
           │  • Report Model     │  │  • Topic Tags       │
           │  • Full-Text Search │  │  • Executive Report │
           └─────────────────────┘  └─────────────────────┘
```

---

## ✨ Core Features

### 1. Executive Analytics Dashboard (`/dashboard`)
- **Key Metrics Row:** Total feedback count, positive sentiment percentage, negative sentiment percentage, and pending queue size.
- **Sentiment Distribution Chart:** Interactive Recharts donut visualization with channel breakdown (Email, Chat, Survey, Social, Manual).
- **Time-Series Volume Trend:** 14-day / 30-day feedback ingestion volume area chart.
- **Top Recurring Topics Chart:** Horizontal frequency bar chart highlighting customer focus areas.
- **Live Stream Feed:** Real-time feed of recent customer feedback with instant single-click AI analysis.

### 2. Feedback Management & Grid / Table Views (`/feedback`)
- **Multi-Factor Filter Bar:** Filter by sentiment, source channel, star rating (1–5), or date range.
- **Instant Search:** Full-text client/server search across customer remarks, names, and topics.
- **Batch Processing:** Select multiple feedback entries to trigger **Bulk AI Analysis** or bulk deletion.
- **Dual Display Modes:** Switch between spacious card view and high-density tabular view.
- **Manual Feedback Creator (`/feedback/add`):** Interactive form with real-time field validation.

### 3. CSV File Ingestion Engine (`/feedback/import`)
- Drag-and-drop or file picker for CSV spreadsheets.
- Built-in CSV parser (PapaParse) with auto-detection of column names (`feedback`, `review`, `comment`, `source`, `rating`, `date`).
- Batch database insertion with skipped row reporting and error diagnostics.
- Direct link to download a bundled sample CSV file (`/sample-feedback.csv`).

### 4. Single Feedback Deep Dive (`/feedback/[id]`)
- Visual sentiment confidence meter (0% to 100%).
- AI reasoning explanation card detailing why Gemini arrived at the classification.
- Interactive topic badges and metadata inspection drawer.
- In-place editing modal with optimistic state updates.
- Raw JSON document inspector for technical review.

### 5. AI Business Intelligence & Insights (`/insights`)
- **Instant Feedback Summarizer:** One-click synthesis of key takeaways, "What Works Well", and "Common Customer Complaints" across all feedback or filtered by positive/negative sentiment.
- **Topic Explorer:** Click any extracted issue tag to view all underlying customer statements.
- **Executive Intelligence Synthesizer:** Multi-paragraph strategic business report generator detailing executive summary, major customer pain points, and recommended actions.
- **Saved Reports Repository (`/reports` & `/reports/[id]`):** Library of past synthesized reports with print/PDF export support.

### 6. Design & Theming
- Seamless **Light & Dark Theme** toggle with anti-FOUC initialization script.
- Responsive sidebar and mobile drawer navigation.
- Toast notifications for every user action via `react-hot-toast`.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router, JavaScript) | Full-stack server and client architecture |
| **Styling** | Tailwind CSS v4 + PostCSS | Modern, utility-first dark/light responsive UI |
| **Database** | MongoDB Atlas & Mongoose | Document datastore for feedback and reports |
| **AI Model** | Google Gemini 1.5 Flash (`@google/generative-ai`) | Fast, structured JSON sentiment and report generation |
| **Charts** | Recharts | Interactive area, donut, and bar data visualizations |
| **Icons** | Lucide React | Clean, consistent SVG icon set |
| **CSV Parsing** | PapaParse | Client-side spreadsheet parsing and row streaming |
| **Notifications**| React Hot Toast | Real-time feedback alerts and status toasts |

---

## 📁 Project Directory Structure

```text
feedbackai/
├── app/
│   ├── api/
│   │   ├── analytics/
│   │   │   ├── overview/route.js    # Aggregated KPI metric counters
│   │   │   ├── topics/route.js      # Frequency and sentiment by topic
│   │   │   └── trends/route.js      # Date-grouped time-series volume
│   │   ├── analyze/
│   │   │   ├── [id]/route.js        # Single feedback AI analysis
│   │   │   └── bulk/route.js        # Batch AI sentiment analysis
│   │   ├── feedback/
│   │   │   ├── route.js             # GET (filtered/paginated) & POST feedback
│   │   │   ├── [id]/route.js        # GET, PUT, DELETE single record
│   │   │   └── import/route.js      # High-speed CSV batch ingestion
│   │   ├── insights/route.js        # Executive business report synthesizer
│   │   ├── reports/
│   │   │   ├── route.js             # GET and POST saved executive reports
│   │   │   └── [id]/route.js        # GET and DELETE single saved report
│   │   └── summarize/route.js       # Fast bulleted summary generator
│   ├── dashboard/page.js            # Main analytics control center
│   ├── feedback/
│   │   ├── page.js                  # Feedback listing, filters, and batch tools
│   │   ├── add/page.js              # Feedback submission form
│   │   ├── import/page.js           # CSV file dropzone and previewer
│   │   └── [id]/page.js             # Deep-dive feedback detail view
│   ├── insights/page.js             # Executive intelligence & topic explorer
│   ├── reports/
│   │   ├── page.js                  # Saved reports index
│   │   └── [id]/page.js             # Report reader and print view
│   ├── globals.css                  # Tailwind v4 configuration & theme variables
│   ├── layout.js                    # Root HTML layout with anti-FOUC theme script
│   └── page.js                      # Root redirect to /dashboard
├── components/
│   ├── analytics/                   # StatsCard, TrendChart, SentimentChart, TopicsChart, RecentFeedback
│   ├── feedback/                    # FilterBar, FeedbackTable, FeedbackCard, FeedbackForm, CSVImporter
│   ├── insights/                    # SummarizePanel, InsightReport, TopicGroup
│   ├── layout/                      # AppShell, Sidebar, Header, ThemeProvider
│   └── ui/                          # Button, Input, Select, Modal, Skeleton, SentimentBadge, EmptyState
├── lib/
│   ├── mongodb.js                   # Cached Mongoose connection singleton
│   ├── gemini.js                    # Gemini AI client with JSON schema & fallback
│   ├── prompts.js                   # Prompt templates for Gemini analysis & synthesis
│   ├── utils.js                     # Date formatting, truncate, and styling helpers
│   └── validators.js                # Input sanitation and schema validators
├── models/
│   ├── Feedback.js                  # Mongoose Feedback collection schema
│   └── Report.js                    # Mongoose Report collection schema
├── public/
│   └── sample-feedback.csv          # Sample dataset for demonstration
├── .env.example                     # Environment variable blueprint
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** v18.17+ or v20+ installed.
- A **MongoDB Atlas** database cluster (free M0 tier works great).
- A free **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Clone the Repository
```bash
git clone https://github.com/Purnansh29/NEXT.JS-Project.git
cd NEXT.JS-Project/feedbackai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/feedbackai?retryWrites=true&w=majority
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 5. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🚀 Deployment Guide

FeedbackAI is optimized for instant deployment to **Vercel** with zero custom server configuration.

👉 **Read the complete step-by-step instructions in [DEPLOYMENT.md](file:///d:/NEXT.JS-Project/feedbackai/DEPLOYMENT.md)**.

### Quick Vercel Setup:
1. Push your code to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"** → select your repo (`Purnansh29/NEXT.JS-Project`).
3. Under **Environment Variables**, set:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `GEMINI_API_KEY`: Your Google Gemini API key.
4. **Crucial:** In MongoDB Atlas → **Network Access**, ensure `0.0.0.0/0` is whitelisted so Vercel's serverless functions can connect.
5. Click **Deploy**!

---

## 🌐 MongoDB Atlas Whitelisting Guide

If you see an error such as:
> `Could not load analytics: connection 1 to 159.41.xxx.xxx:27017 closed`

This occurs because MongoDB Atlas includes a network firewall that blocks incoming database requests by default unless your client IP address is explicitly permitted.

### How to Fix in 2 Minutes:
1. Log in to your **[MongoDB Atlas Console](https://cloud.mongodb.com/)**.
2. In the left navigation menu, click **Security** → **Network Access**.
3. Click the green **"+ Add IP Address"** button.
4. Choose **"Allow Access from Anywhere"** (`0.0.0.0/0`) for development, or click **"Add Current IP Address"**.
5. Click **Confirm**.
6. Wait ~60 seconds for Atlas to update its firewall rules, then click **"Retry"** in the FeedbackAI dashboard.

---

## 🔑 Environment Variables

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string with credentials | `mongodb+srv://user:pass@cluster.mongodb.net/feedbackai` |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key for sentiment analysis & reporting | `AIzaSy...` |
| `PORT` | No | Custom server port (default: 3000) | `3000` |

---

## 📡 API Route Reference

### Feedback APIs
| Method | Endpoint | Query / Body Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/feedback` | `search`, `sentiment`, `source`, `rating`, `page`, `limit` | Paginated, filtered list of customer feedback |
| `POST` | `/api/feedback` | `{ feedbackText, source, rating, customerName, customerEmail }` | Creates a new feedback entry |
| `GET` | `/api/feedback/[id]` | Route param: `id` | Fetches single feedback record with full telemetry |
| `PUT` | `/api/feedback/[id]` | `{ feedbackText, source, rating, sentiment, topics, ... }` | Updates feedback fields |
| `DELETE`| `/api/feedback/[id]` | Route param: `id` | Deletes a single feedback record |
| `POST` | `/api/feedback/import`| `{ rows: [ { feedbackText, source, rating, ... } ] }` | Bulk inserts parsed feedback rows from CSV |

### AI Intelligence APIs
| Method | Endpoint | Payload | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/analyze/[id]` | Route param: `id` | Runs Gemini sentiment & topic extraction on 1 record |
| `POST` | `/api/analyze/bulk` | `{ ids?: string[] }` | Runs batch analysis on selected or all pending records |
| `POST` | `/api/summarize` | `{ sentiment?: "all"\|"positive"\|"negative", timeframeDays?: number }` | Generates bulleted key takeaways and top complaints |
| `POST` | `/api/insights` | `{ title?: string, timeframeDays?: number, saveReport?: boolean }` | Generates full executive intelligence report |

### Analytics & Reports APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/overview` | Total feedback, positive/negative rates, pending count |
| `GET` | `/api/analytics/trends` | Time-series daily feedback volumes |
| `GET` | `/api/analytics/topics` | Top recurring customer topics with sentiment breakdown |
| `GET` | `/api/reports` | List all saved executive reports |
| `GET` | `/api/reports/[id]` | Retrieve single saved executive report |
| `DELETE`| `/api/reports/[id]` | Delete a saved report |

---

## 🗄 Database Schema

### 1. `Feedback` Model (`models/Feedback.js`)
```javascript
{
  feedbackText: { type: String, required: true, trim: true },
  customerName: { type: String, default: 'Anonymous' },
  customerEmail: { type: String, default: '' },
  source: {
    type: String,
    enum: ['email', 'chat', 'survey', 'social', 'manual', 'other'],
    default: 'manual',
  },
  rating: { type: Number, min: 1, max: 5, default: null },
  submissionDate: { type: Date, default: Date.now },

  // AI Analyzed Fields
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'pending'],
    default: 'pending',
  },
  sentimentScore: { type: Number, min: 0, max: 1, default: null },
  reasoning: { type: String, default: '' },
  topics: [{ type: String, trim: true }],
  analysisStatus: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending',
  },
  analyzedAt: { type: Date, default: null },
}
```

### 2. `Report` Model (`models/Report.js`)
```javascript
{
  title: { type: String, required: true },
  period: { type: String, default: 'All Time' },
  executiveSummary: { type: String, required: true },
  strengths: [{ type: String }],
  painPoints: [{ type: String }],
  recommendations: [{ type: String }],
  feedbackAnalyzedCount: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now },
}
```

---

## 🤖 AI Pipeline & Heuristic Fallback

FeedbackAI uses Google's `gemini-1.5-flash` model with **enforced JSON schema output** (`responseMimeType: "application/json"`). This ensures the AI always returns parseable structured data rather than free-form text.

```json
{
  "sentiment": "positive | neutral | negative",
  "score": 0.95,
  "reasoning": "The customer praised immediate response time and courteous support.",
  "topics": ["Customer Support", "Response Time"]
}
```

### Offline Heuristic Fallback
To ensure that academic evaluations and demonstrations **never fail** due to external API quotas, network disconnects, or invalid API keys, `lib/gemini.js` includes an intelligent keyword and star-rating heuristic engine. If Gemini cannot be reached, the system smoothly falls back to local lexical scoring and continues processing without throwing runtime exceptions.

---

## 🎓 College Viva & Technical Interview Guide

Use these talking points when presenting this project:

#### 1. Why Next.js 16 App Router instead of a separate Express.js + React setup?
> *"Next.js 16 App Router provides a unified full-stack architecture. Server Components reduce bundle size by rendering data-heavy components on the server. Route Handlers eliminate the need for a separate Node/Express backend server, reducing infrastructure complexity, deployment costs, and CORS configuration overhead."*

#### 2. Why MongoDB rather than a traditional relational SQL database?
> *"Customer feedback data is inherently semi-structured. Reviews may contain variable metadata such as custom topic tags, fluctuating rating scales, and unstructured reasoning texts. MongoDB's flexible BSON document model allows nesting arrays of topics and AI metrics directly inside the document without complex table joins, speeding up read queries."*

#### 3. How does the dashboard aggregate thousands of feedback records efficiently?
> *"Instead of pulling all documents to the Node.js server and computing averages in JavaScript, we utilize MongoDB's native Aggregation Pipeline (`$match`, `$group`, `$facet`, `$sort`). Calculations happen in-memory directly on the database engine, returning only small aggregated summary payloads over the wire."*

#### 4. How did you handle LLM output unpredictability?
> *"We configured the Gemini API with structured JSON output enforcement (`responseMimeType: 'application/json'`). Furthermore, we implemented schema validation and an automated fallback heuristic analyzer to guarantee resilience against rate limits and network failures."*

#### 5. How is Theme Switching implemented in Tailwind CSS v4?
> *"Tailwind v4 utilizes modern CSS variables and a custom `@custom-variant dark` directive mapped to the `.dark` class. An inline anti-FOUC (Flash of Unstyled Content) script in `layout.js` checks `localStorage` and system preferences before the page renders to avoid theme flickering."*

---

## 📄 License
This project is open-source under the **MIT License**. Created for academic and portfolio demonstration.
