// ============================================================
// DreamerOS Connectors - Provider schema (the open contract)
// ============================================================
// The typed contract that defines a valid DreamerOS connector. Lifted from
// the production registry in dreameros-app-frontend
// (src/lib/integrations/providers.ts) so outside builders work against the
// exact same shape the gateway and the /connect surface already honor.
//
// Connector categories:
//   - ai_tools:        AI clients that wire DreamerOS in via MCP
//   - infrastructure:  cloud, dev, and ops accounts (deploy, hosting, billing)
//   - work:            team and productivity surfaces (chat, mail, issues)
//   - memory_sources:  read-only API keys for ingesting past AI history
//   - commerce:        payments, billing, marketplace targets
//   - creative:        design, media, content surfaces
//   - social_media:    social posting surfaces (owner-approved publishing)
//
// Auth modes:
//   - mcp_client:   the tool consumes the user's MCP URL (deep-link or config)
//   - paste_token:  user pastes a PAT from the provider's settings UI
//   - oauth:        full OAuth handshake brokered by the gateway
//   - api_key:      read-only API key for ingestion
//
// Status lifecycle:
//   - live:           fully wired end to end
//   - paste_setup:    UI is live, awaiting user paste to connect
//   - oauth_pending:  OAuth UI wired, gateway endpoints in progress
//   - coming_online:  shipping next; surfaced as visible-but-pending
//
// Governance positioning: NO per-tool permission toggles. Each connector
// carries an IFP-protected plain-English rule list (ifp_rules) instead of a
// read/write toggle grid. The gateway gates every call through the IFP
// three-axis check before any side effect fires.
// ============================================================

export type ConnectorCategory =
  | "ai_tools"
  | "infrastructure"
  | "work"
  | "memory_sources"
  | "commerce"
  | "creative"
  | "social_media";

export type ConnectorAuthMode = "mcp_client" | "paste_token" | "oauth" | "api_key";

export type ConnectorStatus = "live" | "paste_setup" | "oauth_pending" | "coming_online";

export type ProviderTier = "light" | "pro" | "elite";

export type ConnectionHealth = "active" | "expiring_soon" | "revoked" | null;

export interface Provider {
  /** Stable unique id, lowercase snake_case. Used in the gateway route path. */
  id: string;
  /** Human display name shown on the connector card. */
  name: string;
  category: ConnectorCategory;
  auth_mode: ConnectorAuthMode;
  status: ConnectorStatus;
  /** Brand glyph slug. See providerIconUrl. */
  icon_slug: string;
  /** One-line value statement shown on the card. */
  tagline: string;
  tier_required: ProviderTier;
  /** Plain-English "what can this do" rules, gated by the IFP three-axis check. */
  ifp_rules: string[];
  /** Optional concrete usage example, written for a human. */
  example?: string;
  /** Optional short scope summary (the least-privilege grant to request). */
  scope_summary?: string;
  /** Optional URL where the user creates the token or key. */
  setup_url?: string;
  /** Optional docs URL for this connector. */
  docs_url?: string;
}

/**
 * Build a URL for a provider's brand glyph. Known brands map to the
 * simpleicons CDN (MIT-licensed, no API key). Unknown slugs 404 and the
 * calling UI falls back to a vendored local SVG.
 */
export function providerIconUrl(slug: string): string {
  return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
}

export function tierRank(tier: ProviderTier): number {
  switch (tier) {
    case "light":
      return 0;
    case "pro":
      return 1;
    case "elite":
      return 2;
  }
}

/**
 * Map a gateway-canonical user tier onto the three-step provider ladder.
 * HC and Elite both rank elite. DreamWeaver tiers rank pro. Tier is always
 * resolved server-side from the DB, never from a request body - this helper
 * only ranks an already-resolved tier for UI gating.
 */
export function mapToProviderTier(userTier: string): ProviderTier | null {
  const normalized = userTier.toLowerCase().trim();
  if (normalized === "light") return "light";
  if (
    normalized === "pro" ||
    normalized === "dreamweaver_solo" ||
    normalized === "dreamweaver_duo"
  ) {
    return "pro";
  }
  if (
    normalized === "elite" ||
    normalized === "hc" ||
    normalized === "conductor" ||
    normalized === "founder"
  ) {
    return "elite";
  }
  return null;
}

export function userMeetsTier(
  userTier: string | null | undefined,
  required: ProviderTier
): boolean {
  if (!userTier) return false;
  const mapped = mapToProviderTier(userTier);
  if (!mapped) return false;
  return tierRank(mapped) >= tierRank(required);
}

/** Filter a connector registry by category. */
export function getProvidersByCategory(
  registry: Provider[],
  category: ConnectorCategory
): Provider[] {
  return registry.filter((p) => p.category === category);
}

/** Look up a connector by id in a registry. */
export function getProviderById(
  registry: Provider[],
  id: string
): Provider | undefined {
  return registry.find((p) => p.id === id);
}
