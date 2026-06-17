// ============================================================
// Firecrawl connector - worked example (api-key)
// ============================================================
// Mirrors the production registry entry. Shows the api_key auth mode: a
// read-only key for ingesting external data. Status and tier match what
// the gateway serves today.
// ============================================================

import type { Provider } from "../../packages/schema/src/provider.js";

export const connector: Provider = {
  id: "firecrawl_apikey",
  name: "Firecrawl",
  category: "infrastructure",
  auth_mode: "api_key",
  status: "paste_setup",
  icon_slug: "firecrawl",
  tagline: "Any URL becomes a source your AI can cite. Crawl a competitor, a doc, or a spec - it lands in memory and shapes every answer that follows.",
  tier_required: "light",
  ifp_rules: [
    "Turns any public URL into structured, citable context that compounds in your memory layer across sessions.",
    "Key verified against the team credit-usage endpoint on paste.",
    "Read-only extraction - DreamerOS never writes back to Firecrawl.",
    "Remaining-credit count surfaced on the card; raw key never exposed.",
    "Token health checked every 15 minutes; revokes surface within one cycle.",
  ],
  scope_summary: "API key (fc-*); use a dedicated key you can rotate independently.",
  setup_url: "https://www.firecrawl.dev/app/api-keys",
  docs_url: "/connect/firecrawl_apikey#docs",
};
