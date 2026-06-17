// ============================================================
// Connector template - copy this file to connectors/<your-tool>/connector.ts
// ============================================================
// Fill in every field. Because `connector` is typed as `Provider`, running
// `npx tsc --noEmit` validates this file against the schema. If it compiles,
// the shape is correct. See ../../docs/quickstart.md for the full guide and
// ../../docs/ifp-rules.md for how to write good ifp_rules.
//
// Reminders:
//   - id is lowercase snake_case and becomes the gateway route segment.
//   - Start new connectors at status "coming_online".
//   - Never put a real token, key, client id, or client secret in this file.
//   - No em dashes or en dashes anywhere. Spaced hyphens only.
// ============================================================

import type { Provider } from "../../packages/schema/src/provider.js";

export const connector: Provider = {
  id: "example_tool",
  name: "Example Tool",
  category: "work",
  auth_mode: "oauth",
  status: "coming_online",
  icon_slug: "example",
  tagline: "One line on what this connector gives the operator.",
  tier_required: "pro",
  ifp_rules: [
    "Reads <what it reads> so answers use real data, not guesses.",
    "Write actions (<name them>) are held for your approval before anything fires.",
    "Every action is logged to your audit trail with the originating intent.",
  ],
  scope_summary: "Least-privilege scope to request from the provider.",
  setup_url: "https://example.com/settings/developers",
  docs_url: "/connect/example_tool#docs",
};
