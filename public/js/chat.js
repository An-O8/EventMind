function buildBubble(type, text, withLink = false) {
  const q = encodeURIComponent(text.slice(0, 60) + ' ' + currentEvent);
  const safeTxt = sanitize(text).replace(/\n/g, '<br>');
  const linkHtml = withLink
    ? `<br/><a href="https://www.google.com/search?q=${q}" target="_blank" rel="noopener noreferrer" class="glink">🔍 Search Google for more</a>`
    : '';
  return `${safeTxt}${linkHtml}`;
}

function addMsg(type, text, withLink = false) {
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  const avatarLabel = type === 'ai' ? 'EventMind AI' : 'You';
  div.innerHTML = `
    <div class="msg-avatar ${type === 'ai' ? 'ai-av' : 'user-av'}" aria-label="${avatarLabel}">${type === 'ai' ? '✨' : 'A'}</div>
    <div class="bubble">${buildBubble(type, text, withLink)}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('messages');
  if (!msgs) return null;
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'msg ai typing-wrap';
  div.id = id;
  div.setAttribute('aria-label', 'EventMind AI is typing');
  div.innerHTML = `
    <div class="msg-avatar ai-av" aria-hidden="true">✨</div>
    <div class="typing-bubble">
      <div class="dots" aria-hidden="true">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeTyping(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

function askSug(text) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = text; input.focus(); }
  sendMsg();
}

async function sendMsg() {
  const input = document.getElementById('chatInput');
  const btn = document.getElementById('sendBtn');
  if (!input || !btn) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  addMsg('user', text);

  btn.disabled = true;
  const typingId = showTyping();

  const { chatContext } = getCurrentData();
  const systemPrompt = `You are EventMind, a helpful assistant for ${currentEvent}.
Help attendees with the schedule, finding rooms, food, WiFi, and general event logistics.
Keep replies short and practical — 2-3 sentences usually works. Don't over-explain. If you're not sure about something, say so.

Event info:
${chatContext}`;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: systemPrompt,
        messages: [{ role: 'user', content: text }]
      })
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    removeTyping(typingId);

    if (data.error) throw new Error(data.error.message || 'API returned an error');

    addMsg('ai', data.text || "Hmm, I didn't catch that — please try again!", true);
  } catch (err) {
    removeTyping(typingId);
    console.error('Chat error:', err);
    addMsg('ai', "Connection issue — please check your internet and try again, or search Google for event info.");
  } finally {
    btn.disabled = false;
    input.focus();
  }
}

function initChat() {
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'msg ai';
  const safeEvent = sanitize(currentEvent);
  div.innerHTML = `
    <div class="msg-avatar ai-av" aria-hidden="true">✨</div>
    <div class="bubble">
      Hey! I'm the EventMind assistant for <strong>${safeEvent}</strong> 👋<br/><br/>
      Ask me anything — schedule, rooms, food, WiFi, whatever you need.
      <div class="suggestions" role="group" aria-label="Quick questions">
        <button class="sug" onclick="askSug('What\\'s on right now?')">🔴 What's on now?</button>
        <button class="sug" onclick="askSug('How do I get to Room 3B?')">📍 Room 3B?</button>
        <button class="sug" onclick="askSug('Where\\'s the food?')">🍱 Food?</button>
        <button class="sug" onclick="askSug('What\\'s the WiFi password?')">📶 WiFi?</button>
      </div>
    </div>`;
  msgs.appendChild(div);
}