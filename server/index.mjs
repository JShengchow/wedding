import express from "express";
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { describeIp } from "./ipGeo.mjs";

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
    guests      TEXT    NOT NULL CHECK (guests IN ('0','1','2','3','4','5+','4+')),
    message     TEXT,
    ip          TEXT,
    ua          TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

function migrateGuestConstraintIfNeeded() {
  const row = db
    .prepare(
      "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'wedding_rsvp'",
    )
    .get();
  const tableSql = row?.sql || "";
  if (tableSql.includes("'5+'")) return;

  db.exec(`
    BEGIN;
    CREATE TABLE wedding_rsvp_next (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      phone       TEXT    NOT NULL,
      attendance  TEXT    NOT NULL CHECK (attendance IN ('attend','absent')),
      guests      TEXT    NOT NULL CHECK (guests IN ('0','1','2','3','4','5+','4+')),
      message     TEXT,
      ip          TEXT,
      ua          TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    INSERT INTO wedding_rsvp_next (
      id, name, phone, attendance, guests, message, ip, ua, created_at
    )
      SELECT id, name, phone, attendance, guests, message, ip, ua, created_at
      FROM wedding_rsvp;
    DROP TABLE wedding_rsvp;
    ALTER TABLE wedding_rsvp_next RENAME TO wedding_rsvp;
    COMMIT;
  `);
}

migrateGuestConstraintIfNeeded();

function migrateAnalyticsTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS wedding_visitor (
      id            TEXT PRIMARY KEY,
      rsvp_name     TEXT,
      rsvp_phone    TEXT,
      first_seen_at TEXT NOT NULL,
      last_seen_at  TEXT NOT NULL,
      visit_count   INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS wedding_visit (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id  TEXT NOT NULL,
      theme       TEXT NOT NULL,
      audio_mode  TEXT NOT NULL,
      ip          TEXT,
      ua          TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (visitor_id) REFERENCES wedding_visitor(id)
    );

    CREATE INDEX IF NOT EXISTS idx_wedding_visit_visitor ON wedding_visit(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_wedding_visit_created ON wedding_visit(created_at);
  `);
}

migrateAnalyticsTables();

const insertStmt = db.prepare(`
  INSERT INTO wedding_rsvp (name, phone, attendance, guests, message, ip, ua)
  VALUES (@name, @phone, @attendance, @guests, @message, @ip, @ua)
`);

const selectAllStmt = db.prepare(`
  SELECT id, name, phone, attendance, guests, message, ip, created_at
  FROM wedding_rsvp
  ORDER BY id DESC
`);

const selectRsvpByIdsStmt = db.prepare(`
  SELECT id, name, phone
  FROM wedding_rsvp
  WHERE id = ?
`);

const deleteRsvpByIdStmt = db.prepare(`
  DELETE FROM wedding_rsvp
  WHERE id = ?
`);

const clearVisitorRsvpLinkStmt = db.prepare(`
  UPDATE wedding_visitor
  SET rsvp_name = NULL, rsvp_phone = NULL
  WHERE rsvp_phone = @phone AND rsvp_name = @name
`);

// Admin token is read from the ADMIN_TOKEN env var, or from a file at
// data/admin-token (which lives outside the repo and is never overwritten by
// deploys). When no token is configured the admin endpoints stay disabled.
function loadAdminToken() {
  if (process.env.ADMIN_TOKEN && process.env.ADMIN_TOKEN.trim()) {
    return process.env.ADMIN_TOKEN.trim();
  }
  try {
    const token = fs.readFileSync(path.join(DATA_DIR, "admin-token"), "utf8");
    return token.trim() || null;
  } catch {
    return null;
  }
}

const ADMIN_TOKEN = loadAdminToken();

const PURGE_CONFIRM_TEXT =
  "I confirm that I want to completely clear everything";

function isAdminAuthorized(req, res) {
  if (!ADMIN_TOKEN) {
    res.status(503).json({ error: "admin_disabled" });
    return false;
  }

  const header = String(req.get("authorization") || "").replace(
    /^Bearer\s+/i,
    "",
  );
  const provided = header || String(req.query.token || "");

  const a = Buffer.from(provided);
  const b = Buffer.from(ADMIN_TOKEN);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }

  return true;
}

function verifyAdminTokenValue(token) {
  if (!ADMIN_TOKEN) return false;
  const provided = String(token || "");
  const a = Buffer.from(provided);
  const b = Buffer.from(ADMIN_TOKEN);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function parseRsvpIds(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    return null;
  }

  const ids = [];
  const seen = new Set();
  for (const value of raw) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0 || seen.has(id)) {
      continue;
    }
    seen.add(id);
    ids.push(id);
  }

  if (!ids.length || ids.length > 200) {
    return null;
  }

  return ids;
}

function toCsv(rows) {
  const header = [
    "id",
    "name",
    "phone",
    "attendance",
    "guests",
    "message",
    "created_at",
  ];
  const escape = (value) => {
    if (value == null) return "";
    const str = String(value);
    return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = [
    header.join(","),
    ...rows.map((row) => header.map((key) => escape(row[key])).join(",")),
  ];
  // Prepend a UTF-8 BOM so Excel opens Chinese characters without garbling.
  return "\uFEFF" + lines.join("\r\n");
}

const ATTENDANCE_VALUES = new Set(["attend", "absent"]);
const GUESTS_VALUES = new Set(["0", "1", "2", "3", "4", "5+"]);
const THEME_VALUES = new Set(["bloom", "ink", "noir", "forest", "violet"]);
const AUDIO_MODE_VALUES = new Set(["music", "muted"]);
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SUBMIT_THROTTLE_MS = 5 * 1000;
const VISIT_DEDUPE_MS = 3 * 1000;
const lastIpSubmitAt = new Map();
const lastIpVisitAt = new Map();
const lastVisitorVisitAt = new Map();

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
  for (const [ip, ts] of lastIpVisitAt) {
    if (ts < cutoff) {
      lastIpVisitAt.delete(ip);
    }
  }
  for (const [visitorId, ts] of lastVisitorVisitAt) {
    if (ts < cutoff) {
      lastVisitorVisitAt.delete(visitorId);
    }
  }
}, THROTTLE_PRUNE_MS).unref();

function isUuid(value) {
  return typeof value === "string" && UUID_RE.test(value);
}

function nowIso() {
  return new Date().toISOString();
}

function linkVisitorToRsvp(visitorId, name, phone) {
  if (!isUuid(visitorId)) return;

  const existing = db
    .prepare("SELECT id FROM wedding_visitor WHERE id = ?")
    .get(visitorId);
  const ts = nowIso();

  if (existing) {
    db.prepare(`
      UPDATE wedding_visitor
      SET rsvp_name = @name, rsvp_phone = @phone, last_seen_at = @ts
      WHERE id = @visitorId
    `).run({ visitorId, name, phone, ts });
    return;
  }

  db.prepare(`
    INSERT INTO wedding_visitor (
      id, rsvp_name, rsvp_phone, first_seen_at, last_seen_at, visit_count
    )
    VALUES (@visitorId, @name, @phone, @ts, @ts, 0)
  `).run({ visitorId, name, phone, ts });
}

const recordVisitTx = db.transaction(
  ({ visitorId, theme, audioMode, ip, ua }) => {
    const ts = nowIso();
    const existing = db
      .prepare("SELECT id FROM wedding_visitor WHERE id = ?")
      .get(visitorId);

    if (existing) {
      db.prepare(`
        UPDATE wedding_visitor
        SET last_seen_at = @ts, visit_count = visit_count + 1
        WHERE id = @visitorId
      `).run({ visitorId, ts });
    } else {
      db.prepare(`
        INSERT INTO wedding_visitor (
          id, rsvp_name, rsvp_phone, first_seen_at, last_seen_at, visit_count
        )
        VALUES (@visitorId, NULL, NULL, @ts, @ts, 1)
      `).run({ visitorId, ts });
    }

    db.prepare(`
      INSERT INTO wedding_visit (visitor_id, theme, audio_mode, ip, ua, created_at)
      VALUES (@visitorId, @theme, @audioMode, @ip, @ua, @ts)
    `).run({
      visitorId,
      theme,
      audioMode,
      ip,
      ua,
      ts,
    });

    return db
      .prepare("SELECT visit_count FROM wedding_visitor WHERE id = ?")
      .get(visitorId)?.visit_count;
  },
);

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

    const visitorId =
      typeof req.body?.visitorId === "string" ? req.body.visitorId.trim() : "";
    if (visitorId) {
      linkVisitorToRsvp(visitorId, result.value.name, result.value.phone);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("[rsvp] insert failed", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/visit", (req, res) => {
  const ip = req.ip || req.socket?.remoteAddress || "";

  if (req.body && typeof req.body.hp === "string" && req.body.hp.length > 0) {
    return res.json({ ok: true, deduped: true });
  }

  const visitorId =
    typeof req.body?.visitorId === "string" ? req.body.visitorId.trim() : "";
  const theme = req.body?.theme;
  const audioMode = req.body?.audioMode;

  if (!isUuid(visitorId)) {
    return res.status(400).json({ error: "bad_visitor_id" });
  }
  if (!THEME_VALUES.has(theme)) {
    return res.status(400).json({ error: "bad_theme" });
  }
  if (!AUDIO_MODE_VALUES.has(audioMode)) {
    return res.status(400).json({ error: "bad_audio_mode" });
  }

  const now = Date.now();
  const lastIp = lastIpVisitAt.get(ip) || 0;
  const lastVisitor = lastVisitorVisitAt.get(visitorId) || 0;
  if (now - lastIp < VISIT_DEDUPE_MS || now - lastVisitor < VISIT_DEDUPE_MS) {
    return res.json({ ok: true, deduped: true });
  }

  try {
    const visitCount = recordVisitTx({
      visitorId,
      theme,
      audioMode,
      ip,
      ua: String(req.headers["user-agent"] || "").slice(0, 200),
    });
    lastIpVisitAt.set(ip, now);
    lastVisitorVisitAt.set(visitorId, now);
    res.json({ ok: true, visitCount });
  } catch (err) {
    console.error("[visit] insert failed", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/admin/rsvp", (req, res) => {
  if (!isAdminAuthorized(req, res)) return;

  const rows = selectAllStmt.all();
  const attending = rows.filter((r) => r.attendance === "attend");
  const headcount = attending.reduce((sum, r) => {
    const n =
      r.guests === "5+" ? 5 : r.guests === "4+" ? 4 : Number(r.guests) || 0;
    return sum + n;
  }, 0);

  res.json({
    count: rows.length,
    attendingCount: attending.length,
    absentCount: rows.length - attending.length,
    headcount,
    rows: rows.map((row) => {
      const ipInfo = describeIp(row.ip);
      return {
        ...row,
        ip: ipInfo.ip,
        ipLocation: ipInfo.location,
      };
    }),
  });
});

app.get("/api/admin/rsvp.csv", (req, res) => {
  if (!isAdminAuthorized(req, res)) return;

  const rows = selectAllStmt.all();
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="wedding-rsvp-${date}.csv"`,
  );
  res.send(toCsv(rows));
});

app.get("/api/admin/analytics", (req, res) => {
  if (!isAdminAuthorized(req, res)) return;

  const totalVisits = db
    .prepare("SELECT COUNT(*) AS count FROM wedding_visit")
    .get().count;
  const uniqueVisitors = db
    .prepare("SELECT COUNT(*) AS count FROM wedding_visitor")
    .get().count;
  const identifiedVisitors = db
    .prepare(
      "SELECT COUNT(*) AS count FROM wedding_visitor WHERE rsvp_name IS NOT NULL AND trim(rsvp_name) != ''",
    )
    .get().count;

  const themeStats = Object.fromEntries(
    db
      .prepare(
        "SELECT theme, COUNT(*) AS count FROM wedding_visit GROUP BY theme",
      )
      .all()
      .map((row) => [row.theme, row.count]),
  );
  const audioStats = Object.fromEntries(
    db
      .prepare(
        "SELECT audio_mode, COUNT(*) AS count FROM wedding_visit GROUP BY audio_mode",
      )
      .all()
      .map((row) => [row.audio_mode, row.count]),
  );

  const visitorRows = db
    .prepare(`
      SELECT id, rsvp_name, rsvp_phone, visit_count, first_seen_at, last_seen_at
      FROM wedding_visitor
      ORDER BY visit_count DESC, last_seen_at DESC, id ASC
    `)
    .all();

  const visitRows = db
    .prepare(`
      SELECT id, visitor_id, theme, audio_mode, ip, created_at
      FROM wedding_visit
      ORDER BY id DESC
    `)
    .all();

  const visitsByVisitor = new Map();
  for (const visit of visitRows) {
    if (!visitsByVisitor.has(visit.visitor_id)) {
      visitsByVisitor.set(visit.visitor_id, []);
    }
    const ipInfo = describeIp(visit.ip);
    visitsByVisitor.get(visit.visitor_id).push({
      id: visit.id,
      theme: visit.theme,
      audioMode: visit.audio_mode,
      createdAt: visit.created_at,
      ip: ipInfo.ip,
      ipLocation: ipInfo.location,
    });
  }

  const visitors = visitorRows.map((row) => {
    const visits = visitsByVisitor.get(row.id) || [];
    const latest = visits[0] || null;
    const displayName = row.rsvp_name?.trim()
      ? row.rsvp_name.trim()
      : `访客 ${row.id.slice(0, 4)}`;

    return {
      id: row.id,
      displayName,
      rsvpName: row.rsvp_name,
      rsvpPhone: row.rsvp_phone,
      visitCount: row.visit_count,
      firstSeenAt: row.first_seen_at,
      lastSeenAt: row.last_seen_at,
      lastTheme: latest?.theme || null,
      lastAudioMode: latest?.audioMode || null,
      lastIp: latest?.ip || "",
      lastIpLocation: latest?.ipLocation || "",
      visits,
    };
  });

  res.json({
    summary: {
      totalVisits,
      uniqueVisitors,
      identifiedVisitors,
      themeStats,
      audioStats,
    },
    visitors,
  });
});

app.post("/api/admin/rsvp/delete", (req, res) => {
  if (!isAdminAuthorized(req, res)) return;

  const ids = parseRsvpIds(req.body?.ids);
  if (!ids) {
    return res.status(400).json({ error: "bad_ids" });
  }

  try {
    const deleted = [];
    const deleteTx = db.transaction((targetIds) => {
      for (const id of targetIds) {
        const row = selectRsvpByIdsStmt.get(id);
        if (!row) continue;
        deleteRsvpByIdStmt.run(id);
        clearVisitorRsvpLinkStmt.run({
          name: row.name,
          phone: row.phone,
        });
        deleted.push(row);
      }
    });
    deleteTx(ids);

    if (!deleted.length) {
      return res.status(404).json({ error: "not_found" });
    }

    res.json({ ok: true, deletedCount: deleted.length, deleted });
  } catch (err) {
    console.error("[admin] delete rsvp failed", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/admin/purge", (req, res) => {
  if (!isAdminAuthorized(req, res)) return;

  const confirmText =
    typeof req.body?.confirmText === "string" ? req.body.confirmText.trim() : "";
  if (confirmText !== PURGE_CONFIRM_TEXT) {
    return res.status(400).json({ error: "bad_confirm_text" });
  }

  if (!verifyAdminTokenValue(req.body?.token)) {
    return res.status(401).json({ error: "bad_token" });
  }

  try {
    const purgeTx = db.transaction(() => {
      db.prepare("DELETE FROM wedding_visit").run();
      db.prepare("DELETE FROM wedding_visitor").run();
      db.prepare("DELETE FROM wedding_rsvp").run();
    });
    purgeTx();
    res.json({ ok: true });
  } catch (err) {
    console.error("[admin] purge failed", err);
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
  console.log(`[rsvp] admin endpoints: ${ADMIN_TOKEN ? "enabled" : "disabled"}`);
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
