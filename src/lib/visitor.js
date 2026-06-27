const VISITOR_KEY = "wedding-visitor-id";
const VISIT_ENDPOINT = import.meta.env.VITE_VISIT_ENDPOINT || "/api/visit";

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
  }).catch(() => {
    // Analytics must never block entering the invitation.
  });
}
