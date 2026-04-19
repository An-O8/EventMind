const mockAdd = jest.fn().mockResolvedValue({ id: "doc123" });
const mockSet = jest.fn().mockResolvedValue(undefined);
const mockOnSnapshot = jest.fn();

function makeMockCol() {
  return {
    add: mockAdd,
    orderBy: jest.fn(function() { return { limit: jest.fn(function() { return { onSnapshot: mockOnSnapshot }; }) }; }),
    doc: jest.fn(function() { return { set: mockSet, collection: jest.fn(function() { return makeMockCol(); }), get: jest.fn().mockResolvedValue({ empty: true, docs: [] }) }; }),
    get: jest.fn().mockResolvedValue({ empty: true, docs: [] }),
  };
}

var mockFirestore = jest.fn(function() {
  return { collection: jest.fn(function() { return { doc: jest.fn(function() { return { collection: jest.fn(function() { return makeMockCol(); }) }; }) }; }) };
});
mockFirestore.FieldValue = { serverTimestamp: jest.fn(function() { return "TS"; }) };

global.firebase = {
  apps: [],
  initializeApp: jest.fn(),
  firestore: mockFirestore,
  analytics: jest.fn(function() { return { logEvent: jest.fn() }; }),
};

var firebaseModule = require("../public/js/firebase");
var saveFeedback = firebaseModule.saveFeedback;
var logEvent = firebaseModule.logEvent;
var AnalyticsEvents = firebaseModule.AnalyticsEvents;
var initFirebase = firebaseModule.initFirebase;

afterEach(function() { jest.clearAllMocks(); });

describe("initFirebase()", function() {
  test("calls firebase.initializeApp", function() {
    initFirebase();
    expect(global.firebase.initializeApp).toHaveBeenCalled();
  });
  test("does not throw", function() {
    expect(function() { initFirebase(); }).not.toThrow();
  });
});

describe("saveFeedback() – validation", function() {
  test("throws for rating 0", async function() {
    await expect(saveFeedback("e1", "s1", { rating: 0, comment: "" })).rejects.toThrow("Rating must be between 1 and 5");
  });
  test("throws for rating 6", async function() {
    await expect(saveFeedback("e1", "s1", { rating: 6, comment: "" })).rejects.toThrow();
  });
  test("throws for null rating", async function() {
    await expect(saveFeedback("e1", "s1", { rating: null, comment: "" })).rejects.toThrow();
  });
  test("throws for negative rating", async function() {
    await expect(saveFeedback("e1", "s1", { rating: -1, comment: "" })).rejects.toThrow();
  });
});

describe("AnalyticsEvents", function() {
  test("has CHAT_SENT", function() { expect(AnalyticsEvents.CHAT_SENT).toBeDefined(); });
  test("has SESSION_SAVED", function() { expect(AnalyticsEvents.SESSION_SAVED).toBeDefined(); });
  test("has MAP_OPENED", function() { expect(AnalyticsEvents.MAP_OPENED).toBeDefined(); });
  test("has TRANSLATE_USED", function() { expect(AnalyticsEvents.TRANSLATE_USED).toBeDefined(); });
  test("has FEEDBACK_SUBMITTED", function() { expect(AnalyticsEvents.FEEDBACK_SUBMITTED).toBeDefined(); });
  test("has NETWORK_CONNECT", function() { expect(AnalyticsEvents.NETWORK_CONNECT).toBeDefined(); });
  test("all values are non-empty strings", function() {
    Object.values(AnalyticsEvents).forEach(function(v) {
      expect(typeof v).toBe("string");
      expect(v.length).toBeGreaterThan(0);
    });
  });
  test("no duplicate values", function() {
    var vals = Object.values(AnalyticsEvents);
    expect(new Set(vals).size).toBe(vals.length);
  });
});

describe("logEvent()", function() {
  test("does not throw", function() {
    expect(function() { logEvent("test_event", { foo: "bar" }); }).not.toThrow();
  });
});