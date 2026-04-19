let toastMessages = [];
global.window = { open: jest.fn(), location: { search: "" } };
global.URLSearchParams = class {
  constructor(s) { this._s = s || ""; }
  get(k) { const m = this._s.match(new RegExp(`[?&]${k}=([^&]*)`)); return m ? m[1] : null; }
};

const EVENT_DATA = {
  'TechFest 2026': {
    date: 'Apr 18 · IIT Delhi',
    calUrl: 'https://calendar.google.com/calendar/r/eventedit?text=TechFest+2026',
    sessions: [
      { time: '09:30', title: 'Opening', sub: 'Main Hall', color: '#e84b1e' },
      { time: '11:00', title: 'ML Talk',  sub: 'Room 3B',   color: '#1e6fe8' },
    ],
    attendees: [
      { emoji: '👩‍💻', bg: '#fde68a', name: 'Meera Pillai', role: 'Dev', linkedin: 'meera' },
    ],
    chatContext: 'Date: April 18, 2026 · IIT Delhi',
  },
  'Startup Summit': {
    date: 'Apr 25 · Taj Vivanta',
    calUrl: 'https://calendar.google.com/calendar/r/eventedit?text=Startup+Summit',
    sessions: [{ time: '09:00', title: 'Registration', sub: 'Lobby', color: '#18a558' }],
    attendees: [],
    chatContext: 'Startup Summit context',
  },
};

let currentEvent = 'TechFest 2026';
function getCurrentData() { return EVENT_DATA[currentEvent] || EVENT_DATA['TechFest 2026']; }
function sanitize(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}
function showToast(msg) { toastMessages.push(msg); }

// feedback.js state
let selectedRating = 0;
const MAX_CHARS = 280;

function rateStar(n) {
  selectedRating = n;
  const labels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
  document.querySelectorAll('.star').forEach((s, i) => {
    s.classList.toggle('lit', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  const ratingLabel = document.getElementById('ratingLabel');
  if (ratingLabel) ratingLabel.textContent = `Rating: ${n} out of 5 — ${labels[n - 1]}`;
}

function updateCharCount() {
  const ta = document.getElementById('feedbackText');
  const counter = document.getElementById('charCount');
  if (!ta || !counter) return;
  const remaining = MAX_CHARS - ta.value.length;
  counter.textContent = `${remaining} chars left`;
  counter.style.color = remaining < 30 ? 'var(--accent)' : 'var(--muted)';
}

function submitFeedback() {
  if (!selectedRating) { showToast('Please select a star rating first ⭐'); return; }
  showToast('Feedback submitted! Thank you 🙏');
  const ta = document.getElementById('feedbackText');
  const counter = document.getElementById('charCount');
  if (ta) ta.value = '';
  if (counter) counter.textContent = `${MAX_CHARS} chars left`;
  selectedRating = 0;
  document.querySelectorAll('.star').forEach(s => {
    s.classList.remove('lit');
    s.setAttribute('aria-pressed', 'false');
  });
  const ratingLabel = document.getElementById('ratingLabel');
  if (ratingLabel) ratingLabel.textContent = 'No rating selected';
}

// chat.js functions
function buildBubble(type, text, withLink = false) {
  const q = encodeURIComponent(text.slice(0, 60) + ' ' + currentEvent);
  const safeTxt = sanitize(text).replace(/\n/g, '<br>');
  const linkHtml = withLink
    ? `<br/><a href="https://www.google.com/search?q=${q}" target="_blank" rel="noopener noreferrer" class="glink">🔍 Search Google for more</a>`
    : '';
  return `${safeTxt}${linkHtml}`;
}

beforeEach(() => {
  toastMessages = [];
  selectedRating = 0;
  currentEvent = 'TechFest 2026';
  document.body.innerHTML = `
    <div id="toast"></div>
    <div id="messages"></div>
    <input id="chatInput" value=""/>
    <button id="sendBtn"></button>
    <div id="navEventName"></div>
    <div id="chatSubtitle"></div>
    <div id="searchField" value=""></div>
    <div id="feedbackCard"></div>
    <div id="ratingLabel"></div>
    <textarea id="feedbackText"></textarea>
    <div id="charCount">${MAX_CHARS} chars left</div>
    <div class="stars">
      ${[1,2,3,4,5].map(n => `<button class="star" aria-pressed="false">${n}</button>`).join('')}
    </div>
  `;
});

describe("sanitize()", () => {
  test("escapes < and >", () => {
    expect(sanitize("<b>bold</b>")).toContain("&lt;b&gt;");
  });
  test("escapes script tags", () => {
    const out = sanitize('<script>alert(1)</script>');
    expect(out).not.toContain("<script>");
  });
  test("preserves plain text", () => {
    expect(sanitize("Hello World")).toBe("Hello World");
  });
  test("handles empty string", () => {
    expect(sanitize("")).toBe("");
  });
  test("converts non-strings with String()", () => {
    expect(sanitize(42)).toBe("42");
    expect(sanitize(null)).toBe("null");
  });
});

describe("getCurrentData()", () => {
  test("returns TechFest 2026 by default", () => {
    currentEvent = 'TechFest 2026';
    const data = getCurrentData();
    expect(data.date).toContain('IIT Delhi');
  });
  test("returns Startup Summit when selected", () => {
    currentEvent = 'Startup Summit';
    const data = getCurrentData();
    expect(data.date).toContain('Taj Vivanta');
  });
  test("returns TechFest as fallback for unknown event", () => {
    currentEvent = 'Unknown Event';
    const data = getCurrentData();
    expect(data.date).toContain('IIT Delhi');
  });
  test("returned data has sessions array", () => {
    const data = getCurrentData();
    expect(Array.isArray(data.sessions)).toBe(true);
    expect(data.sessions.length).toBeGreaterThan(0);
  });
  test("returned data has attendees array", () => {
    const data = getCurrentData();
    expect(Array.isArray(data.attendees)).toBe(true);
  });
  test("returned data has chatContext string", () => {
    const data = getCurrentData();
    expect(typeof data.chatContext).toBe("string");
    expect(data.chatContext.length).toBeGreaterThan(0);
  });
  test("sessions have required fields", () => {
    const { sessions } = getCurrentData();
    sessions.forEach(s => {
      expect(s).toHaveProperty('time');
      expect(s).toHaveProperty('title');
      expect(s).toHaveProperty('sub');
      expect(s).toHaveProperty('color');
    });
  });
});

describe("EVENT_DATA", () => {
  test("contains TechFest 2026", () => {
    expect(EVENT_DATA['TechFest 2026']).toBeDefined();
  });
  test("contains Startup Summit", () => {
    expect(EVENT_DATA['Startup Summit']).toBeDefined();
  });
  test("all events have calUrl with calendar.google.com", () => {
    Object.values(EVENT_DATA).forEach(ev => {
      expect(ev.calUrl).toContain('calendar.google.com');
    });
  });
  test("all events have non-empty chatContext", () => {
    Object.values(EVENT_DATA).forEach(ev => {
      expect(ev.chatContext.trim().length).toBeGreaterThan(0);
    });
  });
});

describe("rateStar()", () => {
  test("sets selectedRating to given value", () => {
    rateStar(4);
    expect(selectedRating).toBe(4);
  });
  test("lights correct number of stars", () => {
    rateStar(3);
    const lit = document.querySelectorAll('.star.lit');
    expect(lit.length).toBe(3);
  });
  test("updates ratingLabel text", () => {
    rateStar(5);
    expect(document.getElementById('ratingLabel').textContent).toContain('Excellent');
  });
  test("rating 1 shows Terrible", () => {
    rateStar(1);
    expect(document.getElementById('ratingLabel').textContent).toContain('Terrible');
  });
  test("rating 2 shows Poor", () => {
    rateStar(2);
    expect(document.getElementById('ratingLabel').textContent).toContain('Poor');
  });
  test("sets aria-pressed true on lit stars", () => {
    rateStar(2);
    const stars = document.querySelectorAll('.star');
    expect(stars[0].getAttribute('aria-pressed')).toBe('true');
    expect(stars[1].getAttribute('aria-pressed')).toBe('true');
    expect(stars[2].getAttribute('aria-pressed')).toBe('false');
  });
  test("re-rating changes lit count", () => {
    rateStar(5);
    rateStar(2);
    expect(document.querySelectorAll('.star.lit').length).toBe(2);
  });
});

describe("updateCharCount()", () => {
  test("shows full remaining chars when empty", () => {
    document.getElementById('feedbackText').value = '';
    updateCharCount();
    expect(document.getElementById('charCount').textContent).toBe(`${MAX_CHARS} chars left`);
  });
  test("decrements count as text is typed", () => {
    document.getElementById('feedbackText').value = 'hello';
    updateCharCount();
    expect(document.getElementById('charCount').textContent).toBe(`${MAX_CHARS - 5} chars left`);
  });
  test("shows 0 at max length", () => {
    document.getElementById('feedbackText').value = 'x'.repeat(MAX_CHARS);
    updateCharCount();
    expect(document.getElementById('charCount').textContent).toBe('0 chars left');
  });
});

describe("submitFeedback()", () => {
  test("shows error toast if no rating selected", () => {
    selectedRating = 0;
    submitFeedback();
    expect(toastMessages[0]).toContain('star rating');
  });
  test("shows success toast when rating is set", () => {
    selectedRating = 4;
    submitFeedback();
    expect(toastMessages[0]).toContain('submitted');
  });
  test("resets selectedRating to 0 after submit", () => {
    selectedRating = 3;
    submitFeedback();
    expect(selectedRating).toBe(0);
  });
  test("clears textarea after submit", () => {
    selectedRating = 5;
    document.getElementById('feedbackText').value = 'Great session!';
    submitFeedback();
    expect(document.getElementById('feedbackText').value).toBe('');
  });
  test("resets char counter after submit", () => {
    selectedRating = 4;
    document.getElementById('feedbackText').value = 'some text';
    submitFeedback();
    expect(document.getElementById('charCount').textContent).toBe(`${MAX_CHARS} chars left`);
  });
  test("removes lit class from all stars after submit", () => {
    selectedRating = 5;
    rateStar(5);
    submitFeedback();
    const lit = document.querySelectorAll('.star.lit');
    expect(lit.length).toBe(0);
  });
  test("resets ratingLabel after submit", () => {
    selectedRating = 3;
    submitFeedback();
    expect(document.getElementById('ratingLabel').textContent).toBe('No rating selected');
  });
});

describe("buildBubble()", () => {
  test("returns sanitized text", () => {
    const out = buildBubble('user', 'Hello World');
    expect(out).toContain('Hello World');
  });
  test("escapes HTML in text", () => {
    const out = buildBubble('user', '<script>alert(1)</script>');
    expect(out).not.toContain('<script>');
  });
  test("replaces newlines with <br>", () => {
    const out = buildBubble('ai', 'line1\nline2');
    expect(out).toContain('<br>');
  });
  test("withLink=true adds Google Search link", () => {
    const out = buildBubble('ai', 'Some answer', true);
    expect(out).toContain('google.com/search');
    expect(out).toContain('Search Google');
  });
  test("withLink=false has no Google link", () => {
    const out = buildBubble('user', 'my question', false);
    expect(out).not.toContain('google.com/search');
  });
  test("Google link uses rel=noopener noreferrer", () => {
    const out = buildBubble('ai', 'answer', true);
    expect(out).toContain('noopener noreferrer');
  });
  test("encodes current event in search query", () => {
    currentEvent = 'TechFest 2026';
    const out = buildBubble('ai', 'answer', true);
    expect(out).toContain('TechFest');
  });
});

describe("showToast()", () => {
  test("adds message to toast array", () => {
    showToast('Test message');
    expect(toastMessages).toContain('Test message');
  });
  test("can show multiple toasts", () => {
    showToast('msg1');
    showToast('msg2');
    expect(toastMessages.length).toBeGreaterThanOrEqual(2);
  });
});