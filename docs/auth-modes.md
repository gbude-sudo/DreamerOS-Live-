# Auth modes

A connector declares exactly one `auth_mode`. The gateway brokers the
credential; the connector file never holds one.

## mcp_client

The external tool consumes the user's DreamerOS MCP URL. There is no token
to store on our side - the user installs the MCP server (deep-link or a
config entry) and the tool calls into the gateway. Used by AI clients
(Claude Desktop, Cursor, VS Code, Codex, Lovable, Base44).

## paste_token

The user creates a personal access token in the provider's settings and
pastes it. The gateway verifies it upstream, stores it encrypted, and runs
a health check on a cycle. Used by Railway, Notion, Cloudflare, Airtable,
and similar.

## oauth

A full OAuth handshake brokered by the gateway. The gateway holds the
client id and secret in its environment, mints a CSRF state, and exchanges
the code for tokens. Used by GitHub, Gmail, Linear, Slack, the social
posting connectors, and similar. See `gateway-contract.ts` for the
`oauth/start` and `oauth/callback` shapes.

## api_key

A read-only API key for ingestion or a single-purpose service. The gateway
verifies and stores it encrypted. Used by the memory-source keys (OpenAI,
Anthropic, Perplexity history) and services like Firecrawl, Resend,
ElevenLabs.

## Tier and scope

`tier_required` must match what the gateway enforces. If the gateway gates
the OAuth start with a pro requirement, do not advertise `light` - a
light-tier user would see a connectable card the backend rejects with a
403. Put the least-privilege grant in `scope_summary` so the user requests
only what the connector needs.
