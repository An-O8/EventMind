const EVENT_DATA = {
  'TechFest 2026': {
    date: 'Apr 18 · IIT Delhi',
    calUrl: 'https://calendar.google.com/calendar/r/eventedit?text=TechFest+2026&dates=20260418T093000/20260418T200000&location=IIT+Delhi&details=TechFest+2026',
    sessions: [
      { time: '09:30', title: 'Opening & Introductions',           sub: 'Main Hall · Dr. Verma (delayed ~10 min)', color: '#e84b1e' },
      { time: '11:00', title: 'Deploying ML Models in Production', sub: 'Room 3B · Nisha Agarwal',                color: '#1e6fe8' },
      { time: '12:30', title: 'Lunch + informal catchups',         sub: 'Cafeteria + courtyard',                  color: '#18a558' },
      { time: '14:15', title: 'Founders Q&A (open floor)',         sub: 'Hall B · 3 panelists',                   color: '#f5a623' },
      { time: '16:00', title: 'Lightning Talks',                   sub: 'Room 3B · 5 min slots, signup at desk',  color: '#1e6fe8' },
      { time: '18:00', title: 'Wrap-up + hangout',                 sub: 'Terrace (weather permitting)',            color: '#e84b1e' },
    ],
    attendees: [
      { emoji: '👩‍💻', bg: '#fde68a', name: 'Meera Pillai',   role: 'Backend dev · Razorpay · looking for co-founder', linkedin: 'software+engineer+IIT+Delhi+tech' },
      { emoji: '👨‍🎨', bg: '#dbeafe', name: 'Kabir Sood',     role: 'Design @ early-stage startup · Delhi',             linkedin: 'product+designer+startup+Delhi' },
      { emoji: '👩‍🔬', bg: '#d1fae5', name: 'Tanya Krishnan', role: 'ML researcher · final year · IIT Bombay',           linkedin: 'machine+learning+researcher+IIT' },
      { emoji: '👨‍💼', bg: '#fce7f3', name: 'Dev Anand',      role: 'VC analyst · curious about AI infra',               linkedin: 'venture+capital+analyst+India' },
    ],
    chatContext: `Date: April 18, 2026 · IIT Delhi campus
Schedule: 9:30 Opening (Main Hall, delayed a bit), 11:00 ML in Production (Room 3B · Nisha Agarwal), 12:30 Lunch, 14:15 Founders Q&A open floor (Hall B), 16:00 Lightning Talks (Room 3B), 18:00 Wrap-up (Terrace)
WiFi: TF_Guest (ask at desk if it drops)
Food: cafeteria + stalls near courtyard, veg counter on the left
Room 3B: second left after the stairs near main entrance
Shuttle: last one at 8 PM from Gate 1`,
  },

  'Startup Summit': {
    date: 'Apr 25 · Taj Vivanta, Delhi',
    calUrl: 'https://calendar.google.com/calendar/r/eventedit?text=Startup+Summit&dates=20260425T090000/20260425T190000&location=Taj+Vivanta+Delhi&details=Startup+Summit+2026',
    sessions: [
      { time: '09:00', title: 'Registration + coffee',               sub: 'Lobby',                                   color: '#18a558' },
      { time: '10:00', title: 'State of Indian Startups 2026',       sub: 'Main Stage · Ananya Bose (Sequoia)',       color: '#e84b1e' },
      { time: '11:30', title: 'Pitch competition — Round 1',         sub: 'Hall A · 8 startups, 5 min each',          color: '#1e6fe8' },
      { time: '13:00', title: 'Lunch + investor speed dating',       sub: 'Banquet Hall · pre-register at desk',      color: '#18a558' },
      { time: '15:00', title: 'Panel: Fundraising in a down market', sub: 'Main Stage · 4 founders',                  color: '#f5a623' },
      { time: '17:00', title: 'Pitch finals + awards',               sub: 'Main Stage',                               color: '#e84b1e' },
    ],
    attendees: [
      { emoji: '👩‍💼', bg: '#fde68a', name: 'Ritika Sharma', role: 'Founder · edtech · raising seed round',    linkedin: 'startup+founder+edtech+India' },
      { emoji: '👨‍💻', bg: '#dbeafe', name: 'Aditya Menon',  role: 'Angel investor · ex-Ola · 12 bets so far', linkedin: 'angel+investor+startup+India' },
      { emoji: '👩‍🎨', bg: '#d1fae5', name: 'Pooja Nair',    role: 'Growth @ fintech startup · Series A',       linkedin: 'growth+marketing+fintech+India' },
      { emoji: '👨‍🔬', bg: '#fce7f3', name: 'Sameer Joshi',  role: 'CTO · SaaS · looking to hire senior devs',  linkedin: 'CTO+SaaS+startup+Bangalore' },
    ],
    chatContext: `Date: April 25, 2026 · Taj Vivanta, Delhi
Schedule: 9:00 Registration (Lobby), 10:00 State of Indian Startups (Main Stage), 11:30 Pitch Round 1 (Hall A), 13:00 Lunch + investor speed dating (Banquet Hall, pre-register), 15:00 Fundraising panel (Main Stage), 17:00 Pitch finals + awards
WiFi: Summit_Guest | password at registration desk
Food: lunch in Banquet Hall, snack stalls near lobby
Investor speed dating: slots available at the registration desk
Parking: valet available at main entrance`,
  },

  'Music Fest': {
    date: 'May 3 · Jawaharlal Nehru Stadium',
    calUrl: 'https://calendar.google.com/calendar/r/eventedit?text=Music+Fest+2026&dates=20260503T160000/20260503T230000&location=JLN+Stadium+Delhi&details=Music+Fest+2026',
    sessions: [
      { time: '16:00', title: 'Gates open',         sub: 'All entrances · carry ID',                color: '#18a558' },
      { time: '17:00', title: 'Local acts — Stage B', sub: '3 artists, 20 min sets',                color: '#1e6fe8' },
      { time: '18:30', title: 'Prateek Kuhad',       sub: 'Main Stage',                             color: '#e84b1e' },
      { time: '20:00', title: 'Short break',          sub: 'Food stalls open on west side',          color: '#f5a623' },
      { time: '20:30', title: 'Headline act',         sub: 'Main Stage · surprise announced at 8 PM',color: '#e84b1e' },
      { time: '22:30', title: 'Wrap + exit',          sub: 'Metro shuttle from Gate 3',              color: '#18a558' },
    ],
    attendees: [
      { emoji: '🎸', bg: '#fde68a', name: 'Ishaan Khanna', role: 'Indie musician · playing Stage B at 5:30',  linkedin: 'musician+indie+Delhi' },
      { emoji: '🎧', bg: '#dbeafe', name: 'Zara Patel',    role: 'Music journalist · Rolling Stone India',     linkedin: 'music+journalist+India' },
      { emoji: '🎤', bg: '#d1fae5', name: 'Rohan Mathur',  role: 'Sound engineer · freelance · 7 years',       linkedin: 'sound+engineer+live+events+India' },
      { emoji: '📸', bg: '#fce7f3', name: 'Divya Sethi',   role: 'Event photographer · open to collabs',        linkedin: 'event+photographer+Delhi' },
    ],
    chatContext: `Date: May 3, 2026 · JLN Stadium, Delhi
Schedule: 16:00 Gates open (carry ID), 17:00 Local acts Stage B, 18:30 Prateek Kuhad (Main Stage), 20:00 break, 20:30 Headline act (surprise announced at 8 PM), 22:30 Wrap
WiFi: limited inside stadium, download setlists app beforehand
Food: stalls on the west side, veg options available
Entry: Gate 1 for GA, Gate 3 for premium
Metro shuttle from Gate 3 after the show`,
  },

  'Job Fair': {
    date: 'May 10 · Pragati Maidan, Hall 7',
    calUrl: 'https://calendar.google.com/calendar/r/eventedit?text=Job+Fair+2026&dates=20260510T100000/20260510T170000&location=Pragati+Maidan+Delhi&details=Job+Fair+2026',
    sessions: [
      { time: '10:00', title: 'Doors open · registration',          sub: 'Bring printed CV + ID',                  color: '#18a558' },
      { time: '11:00', title: 'Resume review workshop',             sub: 'Room 7C · free, first-come seats',        color: '#1e6fe8' },
      { time: '12:00', title: 'Recruiter speed interviews',         sub: 'Hall 7 main floor · sign up at entry',    color: '#e84b1e' },
      { time: '13:30', title: 'Lunch break',                        sub: 'Cafeteria, Block B',                      color: '#18a558' },
      { time: '14:30', title: 'Panel: Breaking into product roles', sub: 'Room 7A · 3 PMs from top companies',      color: '#f5a623' },
      { time: '16:00', title: 'Open floor networking',              sub: 'Hall 7 · last chance to hit booths',      color: '#1e6fe8' },
    ],
    attendees: [
      { emoji: '👩‍💼', bg: '#fde68a', name: 'Priya Rajan',  role: 'HR · Swiggy · hiring backend & mobile devs',  linkedin: 'recruiter+tech+Swiggy+India' },
      { emoji: '👨‍💻', bg: '#dbeafe', name: 'Nikhil Verma', role: 'Fresher · CS grad · open to SDE roles',        linkedin: 'software+developer+fresher+India' },
      { emoji: '👩‍🎨', bg: '#d1fae5', name: 'Sneha Bhat',   role: 'UX designer · 3 yrs exp · looking to switch',  linkedin: 'UX+designer+product+India' },
      { emoji: '👨‍🔬', bg: '#fce7f3', name: 'Arjun Das',    role: 'Data scientist · wants ML infra roles',         linkedin: 'data+scientist+machine+learning+India' },
    ],
    chatContext: `Date: May 10, 2026 · Pragati Maidan, Hall 7, Delhi
Schedule: 10:00 Doors open (bring CV + ID), 11:00 Resume workshop (Room 7C, free), 12:00 Recruiter speed interviews (sign up at entry), 13:30 Lunch (Block B cafeteria), 14:30 PM panel (Room 7A), 16:00 Open networking
WiFi: PragatiGuest | no password
Parking: P3 lot, ₹50 flat
Booths: 40+ companies, map at the entry desk
Tips: wear formals, bring 10+ CV copies`,
  },
};

let currentEvent = 'TechFest 2026';

function getCurrentData() {
  return EVENT_DATA[currentEvent] || EVENT_DATA['TechFest 2026'];
}

function sanitize(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

function scrollToEl(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  if (toastTimer) clearTimeout(toastTimer);
  t.textContent = msg;
  t.classList.add('show');
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

function selectEvent(el, name) {
  document.querySelectorAll('.event-pill').forEach(p => {
    p.classList.remove('active');
    p.setAttribute('aria-pressed', 'false');
  });
  el.classList.add('active');
  el.setAttribute('aria-pressed', 'true');
  currentEvent = name;

  const navName = document.getElementById('navEventName');
  const subtitle = document.getElementById('chatSubtitle');
  if (navName) navName.textContent = name;
  if (subtitle) subtitle.textContent = `Knows everything about ${name}`;

  renderSchedule();
  renderNetworking();
  showToast(`Switched to ${name}`);
}

function searchGoogle() {
  const field = document.getElementById('searchField');
  if (!field) return;
  const q = field.value.trim();
  if (!q) { showToast('Please enter something to search'); return; }
  window.open(
    `https://www.google.com/search?q=${encodeURIComponent(q + ' ' + currentEvent)}`,
    '_blank', 'noopener,noreferrer'
  );
}

// Loads custom event config from ?event= URL param (set by organizer.html)
function loadEventFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('event');
    if (!encoded) return false;

    const config = JSON.parse(decodeURIComponent(atob(encoded)));
    if (!config.name || !config.sessions) return false;

    EVENT_DATA[config.name] = {
      date: config.date || config.venue || '',
      calUrl: `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(config.name)}&location=${encodeURIComponent(config.venue || '')}`,
      sessions: config.sessions,
      attendees: [
        { emoji: '👋', bg: '#fde68a', name: 'Someone at this event', role: 'Connect with people here', linkedin: encodeURIComponent(config.name) },
      ],
      chatContext: config.chatContext || `Event: ${config.name}\nVenue: ${config.venue}`,
    };

    currentEvent = config.name;

    const selector = document.querySelector('.event-selector');
    if (selector) {
      selector.innerHTML = `
        <div class="event-pill active" role="button" tabindex="0" aria-pressed="true">🎯 ${config.name}</div>
        <a href="organizer.html" class="event-pill" role="button" tabindex="0" style="text-decoration:none">⚙️ Set up your own</a>`;
    }

    const navName = document.getElementById('navEventName');
    if (navName) navName.textContent = config.name;

    return true;
  } catch (e) {
    console.warn('Could not parse event config from URL', e);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const field = document.getElementById('searchField');
  if (field) field.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchGoogle(); });
  loadEventFromURL();
});