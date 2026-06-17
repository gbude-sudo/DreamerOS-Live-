// ============================================================
// DreamerOS Connectors - Gateway endpoint contract (types only)
// ============================================================
// Type-only declarations for the gateway endpoints a connector speaks to
// once it is promoted from a pre-live status to 'live'. No runtime logic
// lives here; this file is the single source of truth for the request and
// response shapes the gateway honors.
//
// All endpoints live under /api/v1/integrations/{provider}/* on the gateway.
// A frontend proxies them under /api/integrations/{provider}/*.
// ============================================================

/**
 * POST /api/v1/integrations/{provider}/oauth/start
 * Begins an OAuth flow. The gateway mints a CSRF state, persists the pending
 * link, and returns the upstream authorize URL the browser should redirect to.
 * Auth: Supabase access token in the Authorization Bearer header.
 */
export interface OAuthStartResponse {
  authorize_url: string;
  state: string;
}

/**
 * GET /api/v1/integrations/{provider}/oauth/callback?code={code}&state={state}
 * The provider redirects here after consent. The gateway exchanges the code
 * for tokens, stores them encrypted, and 302-redirects back to /connect with
 * a status query param (connected | denied | error | state_mismatch).
 */
export interface OAuthCallbackQuery {
  code: string;
  state: string;
}

/**
 * POST /api/v1/integrations/{provider}/paste-token
 * Paste-token / api-key connect flow. The user pastes a PAT; the gateway
 * verifies it upstream, stores it against the user, and returns the resolved
 * identity and granted scopes. 400 on a bad token.
 */
export interface PasteTokenRequest {
  token: string;
  display_label?: string;
}

export interface PasteTokenResponse {
  connected: boolean;
  id: string;
  provider: string;
  identity: string | null;
  scopes: string[];
}

/**
 * GET /api/v1/integrations/{provider}/health
 * Live connection health for a paste-token / api-key provider. Drives the
 * per-card health pill.
 */
export interface IntegrationHealthResponse {
  alive: boolean;
  connected: boolean;
  status: string | null;
  last_checked: string | null;
}

/**
 * GET /api/v1/integrations/connections
 * All of the user's connections in one call, newest health first.
 */
export interface IntegrationConnection {
  provider: string;
  identity?: string | null;
  status?: string | null;
  last_health_check_at?: string | null;
}

export interface IntegrationConnectionsResponse {
  connections: IntegrationConnection[];
  count: number;
}

/**
 * POST /api/v1/integrations/{provider}/disconnect
 * Revokes the upstream token (best effort), deletes encrypted credentials,
 * and marks the link disconnected.
 */
export interface DisconnectResponse {
  ok: boolean;
}

/**
 * POST /api/v1/integrations/{provider}/sync/trigger
 * DEFERRED: enqueues an on-demand sync run. Returns the run id and initial
 * status so the UI can poll for completion. Shape is the intended contract
 * for when the gateway sync pipeline ships.
 */
export interface SyncTriggerResponse {
  run_id: string;
  status: "queued" | "running" | "succeeded" | "failed";
}

/**
 * GET /api/v1/integrations/{provider}/runs?limit=20
 * DEFERRED: most recent sync runs for the provider, newest first.
 */
export interface IntegrationRun {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  started_at: string;
  finished_at: string | null;
  summary: string;
}

export interface IntegrationRunsResponse {
  runs: IntegrationRun[];
}

/**
 * Standardized shell-state response a proxy returns before the matching
 * gateway endpoint is implemented. Status 501.
 */
export interface IntegrationShellResponse {
  error: "shell";
  provider: string;
  message: string;
}
