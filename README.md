# dreameros-connectors

Build governed integrations for DreamerOS.

This is the public, open contract for wiring any external tool into the
DreamerOS governed AI gateway. It carries everything an outside builder
needs and nothing they should not have: the schema that defines a valid
connector, the type-only gateway contract a connector speaks, a validator,
a copy-me template, and worked examples. The orchestration engine, the
governance runtime (EDE / DAIM / IFP), and the memory layer stay in the
gateway and are not in this repo. The definition format is open; the run
engine is the hosted DreamerOS service.

What makes a DreamerOS connector different:

- Governance-native, not toggle-native. Every connector ships a list of
  plain-English `ifp_rules` ("what can this do") that the gateway gates
  through the IFP three-axis check (Intent x Integrity x Trust) plus the
  EDE and DAIM passes. There are no per-tool read/write permission
  toggles - governance is the product, not a setting.
- MCP-native and memory-aware. Connectors plug into the DreamerOS MCP
  surface and the shared cognitive state, so an integration carries
  context across turns instead of firing a stateless API call.
- Portable. A connector definition plus the operator fingerprint travels
  across vendors (BYOLLM), so an integration is not locked to one runtime.

## Repo layout

```
dreameros-connectors/
  packages/schema/        the open contract (types + validator + helpers)
    src/provider.ts         Provider interface + the four unions + helpers
    src/gateway-contract.ts type-only gateway endpoint contract
    src/validate.ts         runtime validation of a connector object
    src/index.ts            public exports
  connectors/             the connector registry
    _template/connector.ts  copy this to start a new connector
    github/connector.ts     one real worked example (OAuth, live)
  docs/                   quickstart, auth modes, ifp rules, publishing
  .github/workflows/      CI gate: type-check (= schema validation) + dash scan
```

## Quick start

1. Copy `connectors/_template/connector.ts` to
   `connectors/<your-tool>/connector.ts`.
2. Fill in the fields. Because the export is typed `: Provider`, the
   TypeScript compiler validates your connector against the schema -
   `npx tsc --noEmit` is the validation step.
3. Write at least one `ifp_rules` line in plain English describing what
   the connector can do and what stays gated.
4. Open a pull request. CI type-checks every connector and scans for
   em / en dashes (DreamerOS copy canon: spaced hyphens only).
5. A maintainer reviews and merges. The gateway team implements the
   matching `/api/v1/integrations/{provider}/*` endpoints and flips your
   connector `status` to `live`.

See `docs/quickstart.md` for the full walk-through and `docs/publishing.md`
for the path from draft to a live connector.

## Status lifecycle

- `coming_online` - submitted, visible-but-pending, gateway endpoints not
  built yet.
- `oauth_pending` - OAuth UI wired, gateway endpoints in progress.
- `paste_setup` - UI is live, awaiting a user paste to connect.
- `live` - fully wired end to end, reachable at the required tier.

## License

MIT. See `LICENSE`. The open contract is free to build against; the
gateway runtime is the hosted DreamerOS service.
