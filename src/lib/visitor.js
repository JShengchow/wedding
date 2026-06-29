const VISITOR_KEY = "wedding-visitor-id";
const VISIT_ENDPOINT = import.meta.env.VITE_VISIT_ENDPOINT || "/api/visit";
const DURATION_ENDPOINT =
  import.meta.env.VITE_VISIT_DURATION_ENDPOINT || "/api/visit/duration";

let dwellCleanup = null;

export function getVisitorId() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    let id = window.localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function stopDwellTracking() {
  if (dwellCleanup) {
    dwellCleanup();
    dwellCleanup = null;
  }
}

function sendVisitDuration(visitorId, visitId, durationSeconds) {
  const payload = JSON.stringify({
    visitorId,
    visitId,
    durationSeconds,
    hp: "",
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      DURATION_ENDPOINT,
      new Blob([payload], { type: "application/json" }),
    );
    return;
  }

  fetch(DURATION_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // Analytics must never block leaving the invitation.
  });
}

function startDwellTracking(visitId) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const visitorId = getVisitorId();
  if (!visitorId || !visitId) {
    return;
  }

  stopDwellTracking();

  let activeMs = 0;
  let visibleSince =
    document.visibilityState === "visible" ? Date.now() : null;

  const flushActiveTime = () => {
    if (visibleSince == null) {
      return;
    }
    activeMs += Date.now() - visibleSince;
    visibleSince =
      document.visibilityState === "visible" ? Date.now() : null;
  };

  const reportDuration = () => {
    flushActiveTime();
    const durationSeconds = Math.round(activeMs / 1000);
    if (durationSeconds < 1) {
      return;
    }
    sendVisitDuration(visitorId, visitId, durationSeconds);
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      visibleSince = Date.now();
      return;
    }
    reportDuration();
  };

  const onPageHide = () => {
    reportDuration();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onPageHide);

  dwellCleanup = () => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", onPageHide);
  };
}

export function trackVisit({ theme, audioMode }) {
  const visitorId = getVisitorId();
  if (!visitorId || !theme || !audioMode) {
    return;
  }

  fetch(VISIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId,
      theme,
      audioMode,
      hp: "",
    }),
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (data?.visitId) {
        startDwellTracking(data.visitId);
      }
    })
    .catch(() => {
      // Analytics must never block entering the invitation.
    });
}
