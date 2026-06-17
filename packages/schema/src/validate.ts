// ============================================================
// DreamerOS Connectors - runtime validator
// ============================================================
// A small, dependency-free runtime check for a connector object. The
// TypeScript compiler already validates a connector typed `: Provider` at
// build time; this validator is for runtime/registry checks (for example a
// CI script that loads every connector and asserts the registry is sound,
// or a tool that accepts a connector from an untyped JSON source).
// ============================================================

import type {
  Provider,
  ConnectorCategory,
  ConnectorAuthMode,
  ConnectorStatus,
  ProviderTier,
} from "./provider.js";

const CATEGORIES: ConnectorCategory[] = [
  "ai_tools",
  "infrastructure",
  "work",
  "memory_sources",
  "commerce",
  "creative",
  "social_media",
];

const AUTH_MODES: ConnectorAuthMode[] = ["mcp_client", "paste_token", "oauth", "api_key"];

const STATUSES: ConnectorStatus[] = ["live", "paste_setup", "oauth_pending", "coming_online"];

const TIERS: ProviderTier[] = ["light", "pro", "elite"];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate one connector object against the schema. Returns every problem
 * found, not just the first, so an author can fix them all in one pass.
 */
export function validateConnector(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof input !== "object" || input === null) {
    return { valid: false, errors: ["connector must be an object"] };
  }
  const c = input as Record<string, unknown>;

  const requireString = (field: string) => {
    if (typeof c[field] !== "string" || (c[field] as string).trim() === "") {
      errors.push(`${field} is required and must be a non-empty string`);
    }
  };

  requireString("id");
  requireString("name");
  requireString("icon_slug");
  requireString("tagline");

  if (typeof c.id === "string" && !/^[a-z0-9_]+$/.test(c.id)) {
    errors.push("id must be lowercase snake_case (a-z, 0-9, underscore)");
  }

  if (!CATEGORIES.includes(c.category as ConnectorCategory)) {
    errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
  }
  if (!AUTH_MODES.includes(c.auth_mode as ConnectorAuthMode)) {
    errors.push(`auth_mode must be one of: ${AUTH_MODES.join(", ")}`);
  }
  if (!STATUSES.includes(c.status as ConnectorStatus)) {
    errors.push(`status must be one of: ${STATUSES.join(", ")}`);
  }
  if (!TIERS.includes(c.tier_required as ProviderTier)) {
    errors.push(`tier_required must be one of: ${TIERS.join(", ")}`);
  }

  if (!Array.isArray(c.ifp_rules) || c.ifp_rules.length === 0) {
    errors.push("ifp_rules is required and must be a non-empty array of strings");
  } else if (!c.ifp_rules.every((r) => typeof r === "string" && r.trim() !== "")) {
    errors.push("every ifp_rules entry must be a non-empty string");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a whole registry. Also enforces unique ids across the set.
 */
export function validateRegistry(registry: Provider[]): ValidationResult {
  const errors: string[] = [];
  const seen = new Set<string>();

  registry.forEach((connector, index) => {
    const result = validateConnector(connector);
    result.errors.forEach((e) => errors.push(`connector[${index}] (${connector?.id ?? "unknown"}): ${e}`));
    if (connector && typeof connector.id === "string") {
      if (seen.has(connector.id)) {
        errors.push(`duplicate connector id: ${connector.id}`);
      }
      seen.add(connector.id);
    }
  });

  return { valid: errors.length === 0, errors };
}
