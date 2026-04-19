# EventMind – Deployment Guide

---

## Live Deployment

EventMind is deployed on Railway:
**https://eventmind-production.up.railway.app**

---

## Option A — Deploy on Railway (Recommended)

Railway reads your `Dockerfile` automatically and handles everything.

### Prerequisites
- [Railway CLI](https://docs.railway.app/develop/cli) or use the Railway dashboard
- A Groq API key (get one at [console.groq.com](https://console.groq.com))

### Steps

**1. Push to GitHub**
```bash
git add .
git commit -m "deploy"
git push
```

**2. Connect to Railway**
- Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
- Select `An-O8/EventMind`

**3. Set environment variable**
- In Railway dashboard → Variables → Add:
  ```
  GROQ_API_KEY=your_api_key_here
  ```

**4. Done** — Railway builds and deploys automatically on every push.

---

## Option B — Deploy on Google Cloud Run

### Prerequisites

- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated
- [Docker](https://docs.docker.com/get-docker/) installed
- An active GCP project with billing enabled

### Steps

```bash
# Authenticate
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com

# Deploy
gcloud run deploy eventmind \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GROQ_API_KEY=your_api_key_here \
  --memory 256Mi \
  --platform managed
```

When it finishes you'll see:
```
Service URL: https://eventmind-XXXXXXXXXXXX-as.a.run.app
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Groq API key for AI chat |
| `PORT` | No | Defaults to 8080 |

---

## Running Tests Before Deploy

```bash
npm install
npm test
```

All 58 tests should pass before pushing.

---

## Troubleshooting

**Chat not responding after deploy:**
```bash
# Check env vars are set
gcloud run services describe eventmind --region asia-south1
```

**Update API key without redeploying (Cloud Run):**
```bash
gcloud run services update eventmind --region asia-south1 --set-env-vars GROQ_API_KEY=new_key_here
```

**View live logs (Cloud Run):**
```bash
gcloud run services logs read eventmind --region asia-south1
```

---

## Why the Proxy Matters

Calling the Groq API directly from the browser exposes your API key to anyone who opens DevTools. The fix: the browser sends requests to `/api/chat` on the same domain, and `server.js` forwards them to Groq with the key attached server-side. The key never leaves the server.