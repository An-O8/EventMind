const savedSessions = new Set();

function addSession(el, title) {
  if (savedSessions.has(title)) {
    savedSessions.delete(title);
    el.classList.remove('saved');
    el.setAttribute('aria-pressed', 'false');
    showToast(`Removed "${title}" from your saves`);
  } else {
    savedSessions.add(title);
    el.classList.add('saved');
    el.setAttribute('aria-pressed', 'true');
    showToast(`Saved "${title}" ✅`);
  }
}

function addToCalendar() {
  const data = getCurrentData();
  window.open(data.calUrl, '_blank', 'noopener,noreferrer');
  showToast('Opening Google Calendar 📅');
}

function renderSchedule() {
  const card = document.getElementById('scheduleCard');
  if (!card) return;

  const data = getCurrentData();
  savedSessions.clear();

  const rows = data.sessions.map(s => {
    const safeTitle = sanitize(s.title);
    const safeSub = sanitize(s.sub);
    const escapedTitle = s.title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    return `
      <div class="schedule-item"
           onclick="addSession(this,'${escapedTitle}')"
           role="button" tabindex="0" aria-pressed="false"
           aria-label="${safeTitle} at ${s.time} — ${safeSub}. Tap to save."
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();addSession(this,'${escapedTitle}')}">
        <div class="schedule-time" aria-hidden="true">${sanitize(s.time)}</div>
        <div class="schedule-dot" style="background:${sanitize(s.color)}" aria-hidden="true"></div>
        <div>
          <div class="schedule-title">${safeTitle}</div>
          <div class="schedule-sub">${safeSub}</div>
        </div>
      </div>`;
  }).join('');

  card.innerHTML = `
    <div class="card-head">
      <div class="card-title">📋 Today's Schedule</div>
      <div style="font-size:12px;color:var(--muted)">${sanitize(data.date)} · tap to save</div>
    </div>
    ${rows}
    <a href="${sanitize(data.calUrl)}" target="_blank" rel="noopener noreferrer" class="gcal-link">
      📅 Add to Google Calendar →
    </a>`;
}