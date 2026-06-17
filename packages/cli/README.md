# @dreameros/connectors-cli

Command-line on-ramp for building DreamerOS connectors. Dependency-free
(uses only the Node standard library); no build step. No network
calls, no telemetry: it only reads and writes files inside your connectors
checkout.

## Commands

Run from inside a connectors checkout (the folder with `connectors/` and
`packages/schema/`):

```bash
node packages/cli/bin/cli.mjs <command>
```

| Command | What it does |
| --- | --- |
| `scaffold <id>` | Create `connectors/<id>/connector.ts` from the template. |
| `validate` | Type-check every connector against the schema (`tsc --noEmit`). |
| `list` | List the connectors in this checkout. |
| `help` | Show usage. |

### scaffold options

| Flag | Values | Default |
| --- | --- | --- |
| `--name` | display name | derived from id |
| `--category` | ai_tools, infrastructure, work, memory_sources, commerce, creative, social_media | work |
| `--auth` | mcp_client, paste_token, oauth, api_key | oauth |
| `--tier` | light, pro, elite | pro |

Example:

```bash
node packages/cli/bin/cli.mjs scaffold slack --name Slack --category work --auth oauth --tier pro
node packages/cli/bin/cli.mjs validate
```

When published to npm, the `dreameros-connectors` bin makes these available
as `dreameros-connectors scaffold ...`.
