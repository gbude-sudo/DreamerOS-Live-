// ============================================================
// Figma connector - worked example (mcp-client)
// ============================================================
// Mirrors the production registry entry. Shows the mcp_client auth mode:
// the tool consumes the user's MCP URL. Status is coming_online, so this
// is an honest pre-live example (gateway endpoints in progress).
// ============================================================

import type { Provider } from "../../packages/schema/src/provider.js";

export const connector: Provider = {
  id: "figma",
  name: "Figma",
  category: "creative",
  auth_mode: "mcp_client",
  status: "coming_online",
  icon_slug: "figma",
  tagline: "Read design context, push code-to-design, and keep your components in sync - all through one governed MCP connection.",
  tier_required: "pro",
  ifp_rules: [
    "Reads design tokens, component specs, and layout context so answers reference your real design system.",
    "Design edits and asset exports held for approval - you see the affected frames before anything changes.",
    "Code Connect maps Figma components to your codebase; mismatches surface before a deploy.",
    "Every design write logged to your audit trail with the originating intent.",
  ],
  scope_summary: "MCP: read design context + gated write (file scope only)",
  docs_url: "/connect/figma#docs",
};
