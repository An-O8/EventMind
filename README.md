# EventMind – AI Event Companion

> PromptWars Virtual 2026 - Physical Event Experience

---

## What is EventMind?

EventMind is a web app that acts as a personal guide for anyone attending a physical event - a college fest, conference, job fair or concert. Instead of juggling multiple apps and asking strangers for directions, attendees get everything in one place: an AI they can talk to, real time navigation, session scheduling, live translation and networking tools.

The problem it solves is simple - events are chaotic. People miss sessions they'd have loved, get lost in venues, can't find who to talk to and organizers never hear honest feedback until it's too late.

---

## Vertical

**Physical Event Experience** - improving how people navigate, connect and engage during in-person events.

---

## How It Works

Seven modules work together as a single-page app:

**AI Chat** - An event aware assistant with the session schedule, venue layout, speaker info and WiFi credentials loaded into the system prompt. Attendees ask in plain English and get instant answers. Every reply includes a Google Search fallback for deeper exploration.

**Schedule** - Color coded session list with tap-to-save. One click adds the full event to Google Calendar.

**Venue Navigation** - Pre built Google Maps deep links for directions, parking, restaurants, hotels and metro stations. No typing required.

**Live Translate** - Type any announcement, pick a language (Hindi, Tamil, Telugu, Bengali, Marathi, Spanish) and it opens pre filled in Google Translate.

**Session Feedback** - Star rating and free text per session with a live character counter. Ratings are persisted to Firebase Firestore in real time and tracked via Firebase Analytics.

**Networking** - Suggested attendees with one tap LinkedIn connection. Removes the awkwardness of cold networking.

**Organizer Setup** - A separate page where event organizers fill in their details and get a shareable link. When attendees open that link, EventMind auto configures itself for that event - no app download, no signup.

---

## Google Services

| Service | Usage |
|---|---|
| Firebase Firestore | Live announcements, session feedback persistence, attendee check-ins |
| Firebase Analytics | Event tracking — chat sent, maps opened, translate used, feedback submitted |
| Google Maps | Directions, parking, restaurants, nearby metro |
| Google Calendar | Session scheduling and event reminders |
| Google Translate | Multilingual announcements (6 languages) |
| Google Search | AI fallback links and event discovery |
| Google Fonts | DM Sans + Playfair Display typography |
| YouTube | Past session recordings search |
| Google Drive | Speaker slides access |
| Google Meet | Virtual session joining |

---

## Project Structure

```
eventmind/
├── public/
│   ├── index.html              - Main attendee app
│   ├── organizer.html          - Organizer setup page
│   ├── css/
│   │   ├── base.css
│   │   ├── components.css
│   │   └── chat.css
│   └── js/
│       ├── utils.js            - Shared state, toast, sanitizer, event switcher
│       ├── firebase.js         - Firebase Firestore + Analytics integration
│       ├── schedule.js
│       ├── maps.js
│       ├── translate.js
│       ├── feedback.js
│       ├── networking.js
│       ├── resources.js
│       ├── chat.js
│       └── app.js
├── tests/
│   ├── server.test.js          - Express API tests (supertest)
│   ├── frontend.test.js        - Frontend unit tests (jsdom)
│   └── firebase.test.js        - Firebase integration tests
├── server.js                   - Express server + /api/chat proxy
├── package.json
├── Dockerfile
└── .env.example
```

---

## Running Locally

```bash
git clone https://github.com/An-O8/EventMind
cd EventMind
npm install
```

Copy `.env.example` to `.env` and add your Groq API key:

```
GROQ_API_KEY=your_key_here
```

Start the server:

```bash
npm start
```

Open `http://localhost:8080`. No build step, no config beyond the API key.

---

## Testing

The project has 58 tests across three suites covering the Express API, frontend utilities, and Firebase integration.

```bash
npm test
```

| Suite | Coverage |
|---|---|
| server.test.js | /api/chat validation, XSS stripping, error handling, token cap |
| frontend.test.js | sanitizeHTML, URL builders (Maps, Calendar, Translate, LinkedIn), feedback validation, chat rendering |
| firebase.test.js | Firestore feedback validation, Analytics event constants |

---

## Firebase Setup

EventMind uses Firebase Firestore for real-time data and Firebase Analytics for usage tracking.

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add a Web app and copy the config into `public/js/firebase.js`
3. Enable Firestore (Native mode, Standard edition)
4. The SDK is loaded via CDN in `index.html` — no build step needed

---

## Assumptions

- The AI system prompt is hardcoded with event details for the demo. In production this would be fetched from an organizer CMS based on the event ID.
- Google Maps links are pre configured for IIT Delhi. Swapping venues is a one-line change per link.
- The translate module opens Google Translate in a new tab rather than calling the paid API, keeping the app dependency-free.
- Networking uses LinkedIn as the connection layer - no custom social graph needed.

---

## Security

- All user input is sanitized before DOM insertion (XSS prevention).
- The API key never reaches the browser - all AI requests go through the server-side proxy at `/api/chat`.
- Token cap and field whitelist enforced on the proxy.
- External links use `rel="noopener noreferrer"` throughout.

---

## Accessibility

- WCAG 2.1 AA compliant structure with semantic HTML5 landmarks.
- Full keyboard navigation with visible focus styles on every interactive element.
- ARIA roles, labels, and `aria-live` regions throughout.
- Skip-to-content link for screen reader users.
- `prefers-reduced-motion` support - disables the ticker animation.

---

## What's Next

- QR code check-in via Google Vision API
- Firebase Realtime DB for live announcements ticker
- Personalized session recommendations based on attendee profile
- Google Forms + Sheets integration for organizer analytics
- Push notifications for session reminders via Service Worker