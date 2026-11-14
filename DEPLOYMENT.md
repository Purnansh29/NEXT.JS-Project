# 🚀 Deployment Guide – FeedbackAI

This guide provides step-by-step instructions for deploying **FeedbackAI** to **Vercel** (recommended for Next.js App Router) or alternative hosting platforms (Render, Railway).

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have completed the following:

- [x] **Repository is up-to-date on GitHub**: `https://github.com/Purnansh29/NEXT.JS-Project.git`
- [x] **ESLint passes with 0 errors & 0 warnings**: `npm run lint`
- [x] **Next.js production build succeeds**: `npm run build`
- [ ] **MongoDB Atlas Firewall allows cloud IPs**:
  > ⚠️ **CRITICAL:** Vercel functions run in serverless dynamic cloud environments (AWS Lambda). Their outgoing IP addresses change on every execution. In MongoDB Atlas, you **MUST** whitelist `0.0.0.0/0` (Allow Access from Anywhere) in **Security → Network Access**. Otherwise, production API calls will fail with `connection closed`.
- [ ] **Active Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## ⚡ Method 1: Deploy to Vercel (Recommended & 100% Free)

Vercel is the creator of Next.js and provides zero-config hosting for Next.js App Router applications with automatic HTTPS, edge routing, and global CDN.

### Step 1: Sign up / Log in to Vercel
1. Go to **[vercel.com](https://vercel.com/)**.
2. Click **"Sign Up"** or **"Log In"** using your **GitHub account** (`Purnansh29`).

### Step 2: Import your GitHub Repository
1. On your Vercel Dashboard, click **"Add New..."** → **"Project"**.
2. Under "Import Git Repository", find **`Purnansh29/NEXT.JS-Project`**.
3. Click **"Import"**.

### Step 3: Configure Project Settings
- **Project Name:** `feedbackai` (or any custom name)
- **Framework Preset:** `Next.js` (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

### Step 4: Add Environment Variables
Under the **Environment Variables** section, add the following two key-value pairs:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/feedbackai?retryWrites=true&w=majority` | Replace with your actual Atlas cluster URI |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key |

> 💡 **Tip:** Do NOT commit your `.env.local` to GitHub. Vercel securely encrypts these environment variables on their servers.

### Step 5: Click "Deploy"
1. Click the blue **"Deploy"** button.
2. Vercel will install dependencies, run the Next.js production build, and assign you a live HTTPS URL (e.g., `https://feedbackai-gamma.vercel.app`).
3. Your application is now live on the global internet! 🎉

---

## 🛡️ Crucial MongoDB Atlas Configuration for Cloud Deployments

When running locally, your database connection uses your home or college network IP. But when running on Vercel or any cloud server, requests originate from AWS serverless nodes.

### Ensure Atlas Accepts Cloud Traffic:
1. Log in to [cloud.mongodb.com](https://cloud.mongodb.com).
2. Go to **Security** → **Network Access** in the left sidebar.
3. Check the **IP Access List**:
   - If `0.0.0.0/0` is listed with status **Active**, you are all set.
   - If not, click **"+ Add IP Address"**, choose **"Allow Access from Anywhere"**, and click **Confirm**.
4. Also verify in **Security** → **Database Access** that your MongoDB database user has read/write privileges (`readWriteAnyDatabase` or `dbOwner`).

---

## 🔄 Automatic Continuous Deployment (CI/CD)

Whenever you push new changes to the `master` branch:
```bash
git add .
git commit -m "feat: your new feature"
git push origin master
```
Vercel automatically triggers a preview build, runs tests, and updates your live production site with zero downtime!

---

## 🛠️ Alternative Deployment Platforms

### Option B: Deploying to Render (Web Service)
1. Sign in to **[render.com](https://render.com/)**.
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository `NEXT.JS-Project`.
4. Configure:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
5. Under **Environment Variables**, add `MONGODB_URI` and `GEMINI_API_KEY`.
6. Click **"Create Web Service"**.

---

## 🧪 Post-Deployment Verification Checklist

Once your live site is deployed:
1. **Visit Live Dashboard:** Open your `.vercel.app` URL and confirm KPIs and charts load.
2. **Submit Feedback:** Go to `/feedback/add` and submit a test review. Verify that it appears in `/feedback`.
3. **Trigger AI Analysis:** Click **"Analyze with Gemini"** and confirm that sentiment badges and topic tags are generated.
4. **Test CSV Import:** Go to `/feedback/import`, download the sample CSV, upload it, and click import.
5. **Generate an AI Report:** Go to `/insights`, generate an executive report, and save it to the archive.
