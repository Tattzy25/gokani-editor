// worker.js — Zero external dependencies (CORS only)
// Cloudflare Worker that proxies requests to the Dify MCP endpoint.
//
// Environment variables (set in Cloudflare dashboard):
//   DIFY_MCP_URL      — upstream MCP endpoint  (default below)
//   DIFY_TOOL_NAME    — tool name to call       (default: "trash")
//   UPLOADS_BASE_URL  — base URL for relative image paths

const DEFAULT_DIFY_URL      = "https://api.dify.ai/mcp/server/vIKsLS3ToLV1yeUx/mcp"
const DEFAULT_TOOL_NAME     = "trash"
const DEFAULT_UPLOADS_BASE  = "https://tattty-uploads.tattty.com"

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age":       "86400",
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  })
}

function toAbsoluteUrl(input, base) {
  if (!input) return input
  if (/^https?:\/\//i.test(input)) return input
  if (input.startsWith("//"))      return `https:${input}`
  if (input.startsWith("/"))       return `${base}${input}`
  return `${base}/${input}`
}

function normalizeUrls(payload, base) {
  const source =
    Array.isArray(payload?.urls)   ? payload.urls   :
    Array.isArray(payload?.output) ? payload.output :
    Array.isArray(payload?.images) ? payload.images : []

  const urls = source
    .filter((u) => typeof u === "string" && u.length > 0)
    .map((u) => toAbsoluteUrl(u, base))

  return { ...payload, urls }
}

// ---------------------------------------------------------------------------
// Worker entry point
// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    // ── Preflight ──────────────────────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS })
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405)
    }

    // ── Parse body ─────────────────────────────────────────────────────────
    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: "Invalid JSON body" }, 400)
    }

    // ── Config from env (with defaults) ────────────────────────────────────
    const upstreamUrl  = (env.DIFY_MCP_URL    || DEFAULT_DIFY_URL).trim()
    const toolName     = (env.DIFY_TOOL_NAME  || DEFAULT_TOOL_NAME).trim() || "trash"
    const uploadsBase  = (env.UPLOADS_BASE_URL || DEFAULT_UPLOADS_BASE).replace(/\/+$/, "")

    // ── Fields forwarded from the Shopify storefront ────────────────────────
    // The product-page template injects these as URL params which the
    // embedded generator reads and sends here:
    //   customer_id  ← Shopify customer ID   (?client_id=…)
    //   version      ← model version string  (?version=…)
    //   source_id    ← product / page ID     (?source_id=…)
    const difyPayload = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: {
          prompt:         body.prompt         ?? "",
          numOutputs:     body.numOutputs     ?? "1",
          artist_uploads: body.artist_uploads ?? "",
          customer_id:    body.customer_id    ?? "",
          version:        body.version        ?? "",
          source_id:      body.source_id      ?? "",
        },
      },
    }

    // ── Call upstream ───────────────────────────────────────────────────────
    let upstreamRes
    try {
      upstreamRes = await fetch(upstreamUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(difyPayload),
      })
    } catch (e) {
      return json({ error: e?.message || "Upstream fetch failed" }, 502)
    }

    let dify
    try {
      dify = await upstreamRes.json()
    } catch {
      return json({ error: "Upstream returned non-JSON" }, 502)
    }

    if (!upstreamRes.ok || dify?.error) {
      return json(
        { error: dify?.error?.message || `Upstream error (${upstreamRes.status})` },
        upstreamRes.status || 502
      )
    }

    // ── Unwrap nested Dify response ─────────────────────────────────────────
    try {
      const text = dify?.result?.content?.[0]?.text
      if (!text) {
        return json({ error: "Missing result.content[0].text" }, 502)
      }

      const outer = JSON.parse(text)
      if (!outer?.body || typeof outer.body !== "string") {
        return json({ error: "Missing nested body JSON string" }, 502)
      }

      let inner
      try {
        inner = JSON.parse(outer.body)
      } catch {
        // Sanitize control characters that break JSON.parse
        const sanitized = outer.body
          .replace(/\r/g, "\\r")
          .replace(/\n/g, "\\n")
          .replace(/\t/g, "\\t")
        inner = JSON.parse(sanitized)
      }

      return json(normalizeUrls(inner, uploadsBase), 200)
    } catch (e) {
      return json(
        { error: "Failed to parse nested upstream payload", details: e?.message || "parse error" },
        502
      )
    }
  },
}
