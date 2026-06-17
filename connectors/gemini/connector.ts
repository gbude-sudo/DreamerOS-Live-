// ============================================================
// Gemini connector - worked example (paste-token)
// ============================================================
// Mirrors the production registry entry. Shows the paste_token auth mode:
// the user pastes an API key from the provider's settings UI and the
// gateway verifies and stores it. Lifted verbatim from the live registry,
// so the status and tier match what the gateway actually serves.
// ============================================================

import type { Provider } from "../../packages/schema/src/provider.js";

export const connector: Provider = {
  id: "gemini",
  name: "Gemini",
  category: "ai_tools",
  auth_mode: "paste_token",
  status: "paste_setup",
  icon_slug: "googlegemini",
  tagline: "Ask a question and get Gemini's answer right here, run on your own Gemini key.",
  tier_required: "light",
  ifp_rules: [
    "Adds a second reasoning engine to your constellation - use it when you want synthesis, contradiction-surfacing, or long-context depth.",
    "Read-only API key - DreamerOS never writes back to Google.",
    "Prompt routing surfaces each call to the operator before send.",
    "Responses captured to memory layer with full provenance trail.",
    "Key encrypted at rest; rotation reminder at 90 days.",
  ],
  scope_summary: "generativelanguage.googleapis.com prompt API",
  setup_url: "https://aistudio.google.com/app/apikey",
  docs_url: "/connect/gemini#docs",
};
