# Quickstart: build a connector

A connector is one typed object. This guide takes you from copy to pull
request in five steps.

## 1. Copy the template

```bash
cp -R connectors/_template connectors/<your-tool>
```

Rename nothing else; the file stays `connector.ts`.

## 2. Fill in the fields

Open `connectors/<your-tool>/connector.ts` and set:

- `id` - lowercase snake_case, unique. This is the gateway route segment
  (`/api/v1/integrations/<id>/*`).
- `name` - display name on the card.
- `category` - one of `ai_tools`, `infrastructure`, `work`,
  `memory_sources`, `commerce`, `creative`, `social_media`.
- `auth_mode` - one of `mcp_client`, `paste_token`, `oauth`, `api_key`.
  See `auth-modes.md`.
- `status` - start at `coming_online`.
- `icon_slug` - the simpleicons brand slug (or a slug you will vendor).
- `tagline` - one line of value.
- `tier_required` - `light`, `pro`, or `elite`. Match what the gateway
  will enforce; do not advertise a lower tier than the gateway gates.
- `ifp_rules` - at least one plain-English rule. See `ifp-rules.md`.
- optional: `example`, `scope_summary`, `setup_url`, `docs_url`.

## 3. Validate

```bash
npm install
npm run validate   # runs tsc --noEmit
```

Because your export is typed `: Provider`, a clean type-check means the
shape is valid. For a runtime check (for example loading a connector from
JSON), use `validateConnector` from `packages/schema/src/validate.ts`.

## 4. Scan your copy

No em dashes or en dashes anywhere. Search your file for U+2014 and U+2013
and replace with a spaced hyphen. CI enforces this.

## 5. Open a pull request

One connector per PR. CI type-checks the whole registry and scans for
dashes. A maintainer reviews the `ifp_rules` copy and the `auth_mode`
feasibility, then merges. See `publishing.md` for what happens next.
