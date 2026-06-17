# Publishing: from draft to live

A connector moves through four statuses. The connector file in this repo
carries the status; the gateway carries the implementation.

## The lifecycle

1. `coming_online` - your PR is merged. The card is visible-but-pending on
   /connect. No gateway endpoints exist yet.
2. `oauth_pending` - the OAuth UI is wired and the gateway endpoints are in
   progress. The card shows a connect button that is not yet functional.
3. `paste_setup` - for paste-token / api-key connectors, the UI is live
   and waiting for the user to paste a credential.
4. `live` - the gateway implements every
   `/api/v1/integrations/<id>/*` endpoint in `gateway-contract.ts`, the
   OAuth client id and secret (or key verification) are set in the gateway
   environment, and the card is a working connect button gated by tier.

## What the gateway team does to make a connector live

1. Implement the endpoints declared in
   `packages/schema/src/gateway-contract.ts` under
   `/api/v1/integrations/<id>/*`.
2. Set the OAuth client id and secret (or the key verification path) in the
   gateway environment. Never in this repo.
3. Flip `status` to `live` in the connector file and add the vendored
   `/integrations/<icon_slug>.svg` fallback glyph.
4. The card becomes a live connect button, gated by the user's tier and
   re-checked server-side.

## P37: done means customer-usable

A connector is not done when the PR merges. It is done when a paying
customer at the required tier can connect it and use it end to end, with no
mis-selling on the card. Until the gateway endpoints are live and verified,
the connector stays at a pre-live status and the card renders disabled.
