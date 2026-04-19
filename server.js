require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// ── Efficiency: compression ───────────────────────────────────────────────────
// npm install compression  (add to dependencies)
try {
  const compression = require('compression');
  app.use(compression());
} catch(e) { /* compression optional */ }

// ── Security headers ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '16kb' }));

// ── Static files with cache headers ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: true,
  lastModified: true,
}));

// ── Rate limiting (simple in-memory) ─────────────────────────────────────────
const rateMap = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const max = 30;
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) { entry.count = 0; entry.start = now; }
  entry.count++;
  rateMap.set(ip, entry);
  if (entry.count > max) return res.status(429).json({ error: { message: 'Too many requests' } });
  next();
}

app.post('/api/chat', rateLimit, async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: { message: 'Missing GROQ_API_KEY in .env' } });

  const { system, messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: { message: 'messages array is required' } });
  }

  // Whitelist message roles
  const allowedRoles = ['user', 'assistant', 'system'];
  const sanitizedMessages = messages
    .filter(m => allowedRoles.includes(m.role) && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (sanitizedMessages.length === 0) {
    return res.status(400).json({ error: { message: 'No valid messages provided' } });
  }

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          { role: 'system', content: (system || '').slice(0, 4000) },
          ...sanitizedMessages
        ]
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: { message: data?.error?.message || 'Groq API error' } });
    }

    res.json({ text: data?.choices?.[0]?.message?.content || "Sorry, I couldn't get a response." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error: ' + err.message } });
  }
});

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`EventMind running on http://localhost:${PORT}`));