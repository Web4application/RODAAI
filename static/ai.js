// /assets/ai.js
// Simple network helpers used by script.js
// Set API_BASE to your backend base URL. If running alongside the site, use relative path.
export const API_BASE = (typeof window !== "undefined" && window.__API_BASE__) ? window.__API_BASE__ : (location.hostname === "localhost" ? "http://localhost:3000" : "/api");

// POST /api/chat  -> { reply: "text", attachments: [{type, url}] }
export async function sendChatMessage({ message, channel = "general" }) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, channel })
  });
  if (!res.ok) throw new Error(`Chat error ${res.status}`);
  return await res.json();
}

// POST /api/upload (multipart form) -> { url: "...", analysis: "..." }
export async function uploadImage(file, opts = {}) {
  const form = new FormData();
  form.append("file", file);
  if (opts.channel) form.append("channel", opts.channel);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }
  return await res.json();
}

// GET /api/history?channel=... -> [{timestamp, text, analysis, from}]
export async function fetchHistory(channel = "general") {
  const res = await fetch(`${API_BASE}/history?channel=${encodeURIComponent(channel)}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return await res.json();
}
