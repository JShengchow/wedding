import express from "express";
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_DIR = process.env.RSVP_DATA_DIR
  ? path.resolve(process.env.RSVP_DATA_DIR)
  : path.join(__dirname, "data");

fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, "rsvp.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS wedding_rsvp (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    phone       TEXT    NOT NULL,
    attendance  TEXT    NOT NULL CHECK (attendance IN ('attend','absent')),
    guests      TEXT    NOT NULL CHECK (guests IN ('0','1','2','3','4+')),
    message     TEXT,
    ip          TEXT,
    ua          TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

const insertStmt = db.prepare(`
  INSERT INTO wedding_rsvp (name, phone, attendance, guests, message, ip, ua)
  VALUES (@name, @phone, @attendance, @guests, @message, @ip, @ua)
`);

const ATTENDANCE_VALUES = new Set(["attend", "absent"]);
const GUESTS_VALUES = new Set(["0", "1", "2", "3", "4+"]);

const SUBMIT_THROTTLE_MS = 5 * 1000;
const lastIpSubmitAt = new Map();

// Periodically prune the in-memory throttle map so it does not grow unbounded
// for a long-running process. Entries older than 10 minutes are no longer
// relevant for the 5-second window.
const THROTTLE_PRUNE_MS = 10 * 60 * 1000;
setInterval(() => {
  const cutoff = Date.now() - THROTTLE_PRUNE_MS;
  for (const [ip, ts] of lastIpSubmitAt) {
    if (ts < cutoff) {
      lastIpSubmitAt.delete(ip);
    }
  }
}, THROTTLE_PRUNE_MS).unref();

function isString(value, min, max) {
  return (
    typeof value === "string" &&
    value.length >= min &&
    value.length <= max
  );
}

function validatePayload(body) {
  if (!body || typeof body !== "object") {
    return { error: "bad_body" };
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const attendance = body.attendance;
  const guests = body.guests;
  const messageRaw = body.message;

  if (!isString(name, 1, 40)) return { error: "bad_name" };
  if (!isString(phone, 6, 20)) return { error: "bad_phone" };
  if (!ATTENDANCE_VALUES.has(attendance)) return { error: "bad_attendance" };
  if (!GUESTS_VALUES.has(guests)) return { error: "bad_guests" };

  let message = null;
  if (messageRaw != null && messageRaw !== "") {
    if (typeof messageRaw !== "string" || messageRaw.length > 500) {
      return { error: "bad_message" };
    }
    message = messageRaw;
  }

  if (attendance === "absent" && guests !== "0") {
    return { error: "bad_guests_for_absent" };
  }

  return { value: { name, phone, attendance, guests, message } };
}

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.post("/api/rsvp", (req, res) => {
  const ip = req.ip || req.socket?.remoteAddress || "";

  if (req.body && typeof req.body.hp === "string" && req.body.hp.length > 0) {
    // Honeypot: pretend success but never persist.
    return res.json({ ok: true });
  }

  const now = Date.now();
  const last = lastIpSubmitAt.get(ip) || 0;
  if (now - last < SUBMIT_THROTTLE_MS) {
    return res.status(429).json({ error: "too_many_requests" });
  }

  const result = validatePayload(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  try {
    insertStmt.run({
      ...result.value,
      ip,
      ua: String(req.headers["user-agent"] || "").slice(0, 200),
    });
    lastIpSubmitAt.set(ip, now);
    res.json({ ok: true });
  } catch (err) {
    console.error("[rsvp] insert failed", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || "127.0.0.1";

const server = app.listen(port, host, () => {
  console.log(`[rsvp] listening on ${host}:${port}, data dir: ${DATA_DIR}`);
});

function shutdown(signal) {
  console.log(`[rsvp] received ${signal}, shutting down`);
  server.close(() => {
    try {
      db.close();
    } catch (err) {
      console.error("[rsvp] db close error", err);
    }
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 5000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
