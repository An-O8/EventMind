# EventMind – Deployment Guide

---

## Prerequisites

Before you begin, make sure the following are ready:

- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated
- [Docker](https://docs.docker.com/get-docker/) installed
- [Git](https://git-scm.com/) installed and configured
- An active GitHub account
- A Groq API key (get one at [console.groq.com](https://console.groq.com))

---

## Step 1 — Push to GitHub

Create a new **public** repository on GitHub first, then:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/An_O8/eventmind.git
git push -u origin main
```

Keep everything in a single branch (`main`). Repository size must stay under 10 MB.

---

## Step 2 — Set Up Google Cloud

```bash
# Authenticate
gcloud auth login

# Create a new project
gcloud projects create eventmind-2026 --name="EventMind"
gcloud config set project eventmind-2026

# Enable required APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com
```

---

## Step 3 — Deploy to Cloud Run

Run this from the project root. Replace the API key with your actual key.

```bash
gcloud run deploy eventmind \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GROQ_API_KEY=your_api_key_here \
  --memory 256Mi \
  --platform managed
```

Wait about 2 minutes. When it finishes you'll see:

```
Service URL: https://eventmind-XXXXXXXXXXXX-uc.a.run.app
```

That's your Cloud Run URL — paste it into the submission form.

---

## Step 4 — Verify

Open the URL in your browser. The full app should load. Type something in the chat — it should respond through the server-side proxy.

---

## Troubleshooting

**Permission denied when pushing to registry:**
```bash
gcloud auth configure-docker
```

**"API not enabled" error:**
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

**Chat not responding after deploy — check env vars:**
```bash
gcloud run services describe eventmind --region us-central1
```

**Update the API key without redeploying:**
```bash
gcloud run services update eventmind --region us-central1 --set-env-vars GROQ_API_KEY=new_key_here
```

**View live logs:**
```bash
gcloud run services logs read eventmind --region us-central1
```

---

## Why the Proxy Matters

Calling the Groq API directly from the browser is blocked by CORS and it would expose your API key to anyone who opens DevTools. The fix is straightforward: the browser sends requests to `/api/chat` on the same domain (no CORS issue), and `server.js` forwards them to Groq with the key attached server-side. The key never leaves the server.