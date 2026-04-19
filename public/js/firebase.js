/**
 * EventMind – Firebase Integration
 * File: public/js/firebase.js
 */

const firebaseConfig = {
  apiKey: "AIzaSyD-Ejx8rM2RIdfJ77fVuqqSz4CABhWkBsY",
  authDomain: "eventmind-c92f0.firebaseapp.com",
  projectId: "eventmind-c92f0",
  storageBucket: "eventmind-c92f0.firebasestorage.app",
  messagingSenderId: "33630522034",
  appId: "1:33630522034:web:8fdad10f3d5d59028997ab",
  measurementId: "G-SH5HDRNTYJ"
};

let db, analytics;

function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.firestore();
  analytics = firebase.analytics();
  console.log("✅ Firebase initialised");
}

function subscribeAnnouncements(eventId, onUpdate) {
  return db.collection("events").doc(eventId).collection("announcements")
    .orderBy("createdAt", "desc").limit(20)
    .onSnapshot((snapshot) => {
      const announcements = snapshot.docs.map((doc) => ({
        id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate(),
      }));
      onUpdate(announcements);
    });
}

async function postAnnouncement(eventId, message) {
  await db.collection("events").doc(eventId).collection("announcements")
    .add({ message, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}

async function saveFeedback(eventId, sessionId, feedback) {
  if (!feedback.rating || feedback.rating < 1 || feedback.rating > 5)
    throw new Error("Rating must be between 1 and 5");
  await db.collection("events").doc(eventId).collection("sessions")
    .doc(sessionId).collection("feedback")
    .add({
      rating: feedback.rating,
      comment: (feedback.comment || "").slice(0, 500),
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  logEvent("feedback_submitted", { session_id: sessionId, rating: feedback.rating });
}

async function getSessionRating(eventId, sessionId) {
  const snapshot = await db.collection("events").doc(eventId)
    .collection("sessions").doc(sessionId).collection("feedback").get();
  if (snapshot.empty) return { average: 0, count: 0 };
  const ratings = snapshot.docs.map((d) => d.data().rating);
  const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  return { average: Math.round(average * 10) / 10, count: ratings.length };
}

async function checkIn(eventId, sessionId, attendeeId) {
  await db.collection("events").doc(eventId).collection("sessions")
    .doc(sessionId).collection("checkins").doc(attendeeId)
    .set({ checkedInAt: firebase.firestore.FieldValue.serverTimestamp() });
  logEvent("session_checkin", { session_id: sessionId });
}

function logEvent(name, params = {}) {
  if (!analytics) return;
  analytics.logEvent(name, params);
}

const AnalyticsEvents = {
  PAGE_VIEW: "page_view",
  CHAT_SENT: "chat_message_sent",
  SESSION_SAVED: "session_saved_to_calendar",
  MAP_OPENED: "venue_map_opened",
  TRANSLATE_USED: "translate_used",
  NETWORK_CONNECT: "networking_connect_tapped",
  FEEDBACK_SUBMITTED: "feedback_submitted",
  SHARE_LINK_COPIED: "share_link_copied",
};

if (typeof module !== "undefined") {
  module.exports = { initFirebase, subscribeAnnouncements, postAnnouncement,
    saveFeedback, getSessionRating, checkIn, logEvent, AnalyticsEvents };
}