// ============================================================
// GitHub connector - worked example (OAuth, live)
// ============================================================
// Lifted from the production registry entry in dreameros-app-frontend so it
// matches what the gateway actually serves. Use it as a reference for an
// OAuth connector: note the tier_required is "pro" to match the gateway,
// which gates oauth_start with require_pro - advertising "light" would
// promise free access the gateway rejects with a 403.
// ============================================================

import type { Provider } from "../../packages/schema/src/provider.js";

export const connector: Provider = {
  id: "github",
  name: "GitHub",
  category: "infrastructure",
  auth_mode: "oauth",
  status: "live",
  icon_slug: "github",
  tagline: "Push code, open PRs, and run CI on your behalf.",
  tier_required: "pro",
  ifp_rules: [
    "Reads your repo metadata only. Never reads private code without explicit per-action approval.",
    "Write actions (commits, PRs, comments) gated by IFP three-axis verification before send.",
    "Revoked tokens detected within 5 minutes - reconnect prompt fires automatically.",
    "All actions logged to your audit trail (Elite tier - export anytime).",
  ],
  example:
    "Ask what changed in your repo since yesterday and what broke, and the answer comes from your real pull requests and checks, not a guess. Any write - a pull request, a comment - waits for your approval before it fires.",
  scope_summary: "OAuth: repo plus workflow for writes, or repo:status only for read - least-privilege.",
  setup_url: "https://github.com/settings/developers",
  docs_url: "/connect/github#docs",
};
