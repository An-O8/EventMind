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

function renderFeedback() {
  const card = document.getElementById('feedbackCard');
  if (!card) return;

  const stars = [1, 2, 3, 4, 5].map(n =>
    `<button class="star" onclick="rateStar(${n})" aria-label="${n} star${n > 1 ? 's' : ''}" aria-pressed="false">⭐</button>`
  ).join('');

  card.innerHTML = `
    <div class="card-head">
      <div class="card-title">⭐ Rate this session</div>
      <div style="font-size:12px;color:var(--muted)">takes ~10 sec</div>
    </div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:8px">ML in Production · Nisha Agarwal</div>
    <div class="stars" role="group" aria-label="Star rating">${stars}</div>
    <div id="ratingLabel" class="sr-only" aria-live="polite">No rating selected</div>
    <label for="feedbackText" class="sr-only">Your feedback (optional)</label>
    <textarea class="feedback-area" id="feedbackText" maxlength="${MAX_CHARS}"
      placeholder="Share your thoughts about the session..."
      oninput="updateCharCount()"
      aria-describedby="charCount"></textarea>
    <div class="char-counter" id="charCount" aria-live="polite">${MAX_CHARS} chars left</div>
    <button class="submit-feedback" onclick="submitFeedback()">Submit Feedback →</button>`;
}