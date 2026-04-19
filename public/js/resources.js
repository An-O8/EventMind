const resourceLinks = [
  { icon: '🎬', label: 'Past TechFest talks on YouTube', url: 'https://www.youtube.com/results?search_query=TechFest+IIT+Delhi' },
  { icon: '🔍', label: 'Google this event',              url: 'https://www.google.com/search?q=TechFest+IIT+Delhi+2026' },
  { icon: '📁', label: 'Speaker slides (Drive folder)',   url: 'https://drive.google.com' },
  { icon: '📹', label: 'Join virtual / remote sessions', url: 'https://meet.google.com' },
];

function renderResources() {
  const card = document.getElementById('resourcesCard');
  if (!card) return;

  const links = resourceLinks.map(r => `
    <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="map-btn" aria-label="${sanitize(r.label)} — opens in new tab">
      <span aria-hidden="true">${r.icon}</span>${sanitize(r.label)}
    </a>`).join('');

  card.innerHTML = `
    <div class="card-head">
      <div class="card-title">📚 Event Resources</div>
      <div style="font-size:12px;color:var(--muted)">Powered by Google</div>
    </div>
    <div class="resources-grid">${links}</div>`;
}