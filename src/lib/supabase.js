import { getVisitorId } from "./visitor";

const RSVP_ENDPOINT =
  import.meta.env.VITE_RSVP_ENDPOINT || "/api/rsvp";

const LOCAL_STORAGE_KEY = "wedding-rsvp";

export const isSupabaseConfigured = false;

class RsvpError extends Error {
  constructor(code, status, message) {
    super(message || code);
    this.name = "RsvpError";
    this.code = code;
    this.status = status;
  }
}

function saveLocally(payload) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    const list = JSON.parse(
      window.localStorage.getItem(LOCAL_STORAGE_KEY) || "[]",
    );
    list.push({ ...payload, createdAt: new Date().toISOString() });
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage may be disabled (private mode, quota), ignore silently
  }
}

async function parseError(res) {
  let code = `http_${res.status}`;
  try {
    const data = await res.json();
    if (data && typeof data.error === "string") {
      code = data.error;
    }
  } catch {
    // ignore non-JSON body
  }
  return new RsvpError(code, res.status, code);
}

export async function submitRsvp(form) {
  const payload = {
    name: form.name,
    phone: form.phone,
    attendance: form.attendance,
    guests: form.guests,
    message: form.message || null,
    hp: form.hp || "",
    visitorId: getVisitorId() || undefined,
  };

  let response;
  try {
    response = await fetch(RSVP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    saveLocally(payload);
    throw new RsvpError(
      "network_error",
      0,
      networkErr?.message || "network_error",
    );
  }

  if (!response.ok) {
    const err = await parseError(response);
    // Throttled requests are not "lost"; only persist genuine failures locally.
    if (err.status !== 429) {
      saveLocally(payload);
    }
    throw err;
  }
}
