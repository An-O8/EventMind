const request = require("supertest");
const express = require("express");
const path = require("path");

process.env.GROQ_API_KEY = "test-key-123";
global.fetch = jest.fn();

function createApp() {
  const app = express();
  app.use(express.json({ limit: "16kb" }));
  app.use(express.static(path.join(__dirname, "../public")));

  app.post("/api/chat", async (req, res) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: { message: "Missing GROQ_API_KEY in .env" } });
    const { system, messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: { message: "messages array is required" } });
    try {
      const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 300,
          temperature: 0.7,
          messages: [
            { role: "system", content: system || "" },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      const data = await upstream.json();
      if (!upstream.ok)
        return res.status(upstream.status).json({ error: { message: data?.error?.message || "Groq API error" } });
      res.json({ text: data?.choices?.[0]?.message?.content || "Sorry, I couldn't get a response." });
    } catch (err) {
      res.status(500).json({ error: { message: "Server error: " + err.message } });
    }
  });

  app.get("*", (req, res) => res.sendFile(path.join(__dirname, "../public", "index.html")));
  return app;
}

let app;
beforeAll(() => { app = createApp(); });
afterEach(() => jest.clearAllMocks());

const mockOk = (text = "Hall A is on the ground floor.") =>
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ choices: [{ message: { content: text } }] }),
  });

describe("Static files", () => {
  test("GET / returns 200 HTML", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
  });
  test("GET /organizer.html returns 200", async () => {
    const res = await request(app).get("/organizer.html");
    expect(res.status).toBe(200);
  });
  test("unknown route serves index.html (SPA fallback)", async () => {
    const res = await request(app).get("/some/deep/route");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
  });
});

describe("POST /api/chat – happy path", () => {
  test("returns text for valid request", async () => {
    mockOk("Hall A is on the ground floor.");
    const res = await request(app).post("/api/chat").send({
      system: "You are EventMind",
      messages: [{ role: "user", content: "Where is Hall A?" }],
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("text");
    expect(res.body.text).toBe("Hall A is on the ground floor.");
  });

  test("sends correct model to Groq", async () => {
    mockOk();
    await request(app).post("/api/chat").send({
      system: "sys", messages: [{ role: "user", content: "hi" }],
    });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.model).toBe("llama-3.1-8b-instant");
  });

  test("includes system prompt in Groq request", async () => {
    mockOk();
    await request(app).post("/api/chat").send({
      system: "You are EventMind for TechFest",
      messages: [{ role: "user", content: "hi" }],
    });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    const sys = body.messages.find((m) => m.role === "system");
    expect(sys.content).toBe("You are EventMind for TechFest");
  });

  test("includes user message in Groq request", async () => {
    mockOk();
    await request(app).post("/api/chat").send({
      system: "sys", messages: [{ role: "user", content: "Where is the food?" }],
    });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    const user = body.messages.find((m) => m.role === "user");
    expect(user.content).toBe("Where is the food?");
  });

  test("max_tokens is 300", async () => {
    mockOk();
    await request(app).post("/api/chat").send({
      system: "sys", messages: [{ role: "user", content: "hi" }],
    });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.max_tokens).toBe(300);
  });

  test("returns fallback text when content is empty", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: "" } }] }),
    });
    const res = await request(app).post("/api/chat").send({
      system: "sys", messages: [{ role: "user", content: "hi" }],
    });
    expect(res.body.text).toBeTruthy();
  });

  test("API key is sent in Authorization header", async () => {
    mockOk();
    await request(app).post("/api/chat").send({
      system: "sys", messages: [{ role: "user", content: "hi" }],
    });
    const headers = global.fetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBe("Bearer test-key-123");
  });
});

describe("POST /api/chat – validation", () => {
  test("rejects empty messages array", async () => {
    const res = await request(app).post("/api/chat").send({ system: "s", messages: [] });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("messages array is required");
  });

  test("rejects missing messages field", async () => {
    const res = await request(app).post("/api/chat").send({ system: "s" });
    expect(res.status).toBe(400);
  });

  test("rejects non-array messages", async () => {
    const res = await request(app).post("/api/chat").send({ system: "s", messages: "hello" });
    expect(res.status).toBe(400);
  });

  test("accepts request without system prompt", async () => {
    mockOk("ok");
    const res = await request(app).post("/api/chat").send({
      messages: [{ role: "user", content: "hi" }],
    });
    expect(res.status).toBe(200);
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    const sys = body.messages.find((m) => m.role === "system");
    expect(sys.content).toBe("");
  });
});

describe("POST /api/chat – upstream errors", () => {
  test("returns 500 when fetch throws", async () => {
    global.fetch.mockRejectedValue(new Error("ECONNREFUSED"));
    const res = await request(app).post("/api/chat").send({
      system: "s", messages: [{ role: "user", content: "hi" }],
    });
    expect(res.status).toBe(500);
    expect(res.body.error.message).toContain("Server error");
  });

  test("forwards Groq error status", async () => {
    global.fetch.mockResolvedValue({
      ok: false, status: 429,
      json: async () => ({ error: { message: "rate limited" } }),
    });
    const res = await request(app).post("/api/chat").send({
      system: "s", messages: [{ role: "user", content: "hi" }],
    });
    expect(res.status).toBe(429);
    expect(res.body.error.message).toBe("rate limited");
  });

  test("uses fallback error message when Groq gives none", async () => {
    global.fetch.mockResolvedValue({
      ok: false, status: 500,
      json: async () => ({}),
    });
    const res = await request(app).post("/api/chat").send({
      system: "s", messages: [{ role: "user", content: "hi" }],
    });
    expect(res.body.error.message).toBe("Groq API error");
  });

  test("does not leak API key in error response", async () => {
    global.fetch.mockRejectedValue(new Error("network fail"));
    const res = await request(app).post("/api/chat").send({
      system: "s", messages: [{ role: "user", content: "hi" }],
    });
    expect(JSON.stringify(res.body)).not.toContain("test-key-123");
  });
});

describe("POST /api/chat – multi-turn", () => {
  test("passes multiple messages to Groq", async () => {
    mockOk("Sure!");
    await request(app).post("/api/chat").send({
      system: "s",
      messages: [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi!" },
        { role: "user", content: "Where is Hall B?" },
      ],
    });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    // system + 3 messages = 4 total
    expect(body.messages.length).toBe(4);
  });
});