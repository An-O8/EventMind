const langs = [
  { code: 'hi', label: 'हिंदी',   name: 'Hindi' },
  { code: 'ta', label: 'தமிழ்',   name: 'Tamil' },
  { code: 'te', label: 'తెలుగు',  name: 'Telugu' },
  { code: 'bn', label: 'বাংলা',   name: 'Bengali' },
  { code: 'mr', label: 'मराठी',   name: 'Marathi' },
  { code: 'es', label: 'Español', name: 'Spanish' },
];
let targetLang = 'hi';

function setLang(code, el) {
  targetLang = code;
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  el.classList.add('active');
  el.setAttribute('aria-pressed', 'true');
}

function doTranslate() {
  const input = document.getElementById('translateIn');
  const output = document.getElementById('translateOut');
  if (!input || !output) return;

  const text = input.value.trim();
  if (!text) { showToast('Please enter text to translate 📝'); input.focus(); return; }

  const url = `https://translate.google.com/?sl=en&tl=${encodeURIComponent(targetLang)}&text=${encodeURIComponent(text)}&op=translate`;
  window.open(url, '_blank', 'noopener,noreferrer');
  output.textContent = 'Translation opened in Google Translate →';
}

function renderTranslate() {
  const card = document.getElementById('translateCard');
  if (!card) return;

  const langBtns = langs.map((l, i) => `
    <button class="lang-btn ${i === 0 ? 'active' : ''}"
            onclick="setLang('${l.code}', this)"
            aria-pressed="${i === 0 ? 'true' : 'false'}"
            aria-label="Translate to ${l.name}">${l.label}</button>
  `).join('');

  card.innerHTML = `
    <div class="card-head">
      <div class="card-title">🌐 Live Translate</div>
      <div style="font-size:12px;color:var(--muted)">6 languages</div>
    </div>
    <div class="lang-grid" role="group" aria-label="Select target language">${langBtns}</div>
    <label for="translateIn" class="sr-only">Text to translate</label>
    <textarea class="translate-input" id="translateIn"
              placeholder="Type announcement or phrase..."
              rows="2"
              aria-label="Enter English text to translate"></textarea>
    <div class="translate-output" id="translateOut" aria-live="polite" aria-atomic="true">Translation appears here...</div>
    <button class="translate-btn" onclick="doTranslate()">🌐 Translate via Google</button>`;
}