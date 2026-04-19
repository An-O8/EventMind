function connectAttendee(btn, linkedinQuery) {
  if (btn.disabled || btn.classList.contains('connected')) return;
  window.open(`https://www.linkedin.com/search/results/people/?keywords=${linkedinQuery}`, '_blank', 'noopener,noreferrer');
  btn.classList.add('connected');
  btn.textContent = '✓ Opened';
  btn.disabled = true;
  btn.setAttribute('aria-label', 'LinkedIn search opened');
  showToast('LinkedIn search opened — find and connect 💼');
}

function renderNetworking() {
  const section = document.getElementById('networking');
  if (!section) return;

  const data = getCurrentData();

  const list = data.attendees.map(a => {
    const safeName = sanitize(a.name);
    const safeRole = sanitize(a.role);
    const safeQuery = encodeURIComponent(a.linkedin);
    return `
      <div class="attendee" role="listitem">
        <div class="att-avatar" style="background:${sanitize(a.bg)}" aria-hidden="true">${a.emoji}</div>
        <div class="att-info">
          <div class="att-name">${safeName}</div>
          <div class="att-role">${safeRole}</div>
        </div>
        <button class="connect-btn" onclick="connectAttendee(this, '${safeQuery}')" aria-label="Find ${safeName} on LinkedIn">Connect</button>
      </div>`;
  }).join('');

  const eventQuery = encodeURIComponent(currentEvent.replace(/ /g, '+'));

  section.innerHTML = `
    <div class="card-head">
      <div class="card-title">🤝 People at this event</div>
      <div style="font-size:12px;color:var(--muted)">tap connect to find on LinkedIn</div>
    </div>
    <div class="attendee-list" role="list" aria-label="Suggested attendees">${list}</div>
    <div style="margin-top:14px">
      <a href="https://www.linkedin.com/search/results/people/?keywords=${eventQuery}"
         target="_blank" rel="noopener noreferrer" class="map-btn" style="justify-content:center"
         aria-label="Find more attendees on LinkedIn">
        💼 Find more people from this event on LinkedIn
      </a>
    </div>`;
}