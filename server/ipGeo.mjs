import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const IP2Region = require("ip2region").default;

let query = null;

function getQuery() {
  if (!query) {
    query = new IP2Region();
  }
  return query;
}

export function normalizeClientIp(ip) {
  const raw = String(ip || "").trim();
  if (!raw) return "";
  if (raw.startsWith("::ffff:")) {
    return raw.slice(7);
  }
  return raw;
}

function isPrivateIp(ip) {
  if (ip === "127.0.0.1" || ip === "::1") return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  return false;
}

function cleanPart(value) {
  const part = String(value || "").trim();
  if (!part || part === "0") return "";
  return part;
}

export function describeIp(ip) {
  const normalized = normalizeClientIp(ip);
  if (!normalized) {
    return { ip: "", location: "" };
  }
  if (isPrivateIp(normalized)) {
    return { ip: normalized, location: "本地网络" };
  }

  try {
    const result = getQuery().search(normalized);
    if (!result) {
      return { ip: normalized, location: "未知" };
    }

    const parts = [
      cleanPart(result.country),
      cleanPart(result.province),
      cleanPart(result.city),
    ].filter(Boolean);
    const location = parts.length
      ? parts.join(" ")
      : cleanPart(result.isp) || "未知";

    return { ip: normalized, location };
  } catch {
    return { ip: normalized, location: "未知" };
  }
}
