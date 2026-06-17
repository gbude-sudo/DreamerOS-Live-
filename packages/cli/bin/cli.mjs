#!/usr/bin/env node
// ============================================================
// dreameros-connectors - command-line on-ramp
// ============================================================
// Dependency-free Node CLI for working in a connector registry checkout.
//   scaffold <id>   create connectors/<id>/connector.ts from the template
//   validate        type-check every connector against the schema (tsc)
//   list            list the connectors in this checkout
//   help            show usage
// No build step and no runtime dependencies: it uses only node:fs,
// node:path, and node:child_process.
// ============================================================
import { existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const CATEGORIES = ["ai_tools", "infrastructure", "work", "memory_sources", "commerce", "creative", "social_media"];
const AUTH_MODES = ["mcp_client", "paste_token", "oauth", "api_key"];
const TIERS = ["light", "pro", "elite"];

function findRepoRoot(start) {
  let dir = start;
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, "connectors")) && existsSync(join(dir, "packages", "schema"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function fail(msg) {
  console.error("error: " + msg);
  process.exit(1);
}

function parseFlags(args) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      flags[key] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "true";
    } else {
      positional.push(args[i]);
    }
  }
  return { flags, positional };
}

function help() {
  console.log(`dreameros-connectors - build governed integrations for DreamerOS

Usage:
  dreameros-connectors scaffold <id> [options]   create a new connector
  dreameros-connectors validate                  type-check every connector
  dreameros-connectors list                      list connectors in this checkout
  dreameros-connectors help                      show this help

scaffold options:
  --name <name>          display name (default: derived from id)
  --category <category>  one of: ${CATEGORIES.join(", ")}
  --auth <auth_mode>     one of: ${AUTH_MODES.join(", ")}
  --tier <tier>          one of: ${TIERS.join(", ")}

Examples:
  dreameros-connectors scaffold slack --name Slack --category work --auth oauth --tier pro
  dreameros-connectors validate
`);
}

function template({ id, name, category, auth, tier }) {
  return `import type { Provider } from "../../packages/schema/src/provider.js";

export const connector: Provider = {
  id: "${id}",
  name: "${name}",
  category: "${category}",
  auth_mode: "${auth}",
  status: "coming_online",
  icon_slug: "${id}",
  tagline: "One line on what this connector gives the operator.",
  tier_required: "${tier}",
  ifp_rules: [
    "Reads <what it reads> so answers use real data, not guesses.",
    "Write actions (<name them>) are held for your approval before anything fires.",
    "Every action is logged to your audit trail with the originating intent.",
  ],
  scope_summary: "Least-privilege scope to request from the provider.",
  setup_url: "https://${id}.com/settings/developers",
  docs_url: "/connect/${id}#docs",
};
`;
}

function scaffold(root, positional, flags) {
  const id = positional[0];
  if (!id) fail("scaffold needs an id, for example: dreameros-connectors scaffold slack");
  if (!/^[a-z0-9_]+$/.test(id)) fail("id must be lowercase snake_case (a-z, 0-9, underscore)");
  const category = flags.category || "work";
  const auth = flags.auth || "oauth";
  const tier = flags.tier || "pro";
  if (!CATEGORIES.includes(category)) fail(`--category must be one of: ${CATEGORIES.join(", ")}`);
  if (!AUTH_MODES.includes(auth)) fail(`--auth must be one of: ${AUTH_MODES.join(", ")}`);
  if (!TIERS.includes(tier)) fail(`--tier must be one of: ${TIERS.join(", ")}`);
  const name = flags.name || id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const dir = join(root, "connectors", id);
  const file = join(dir, "connector.ts");
  if (existsSync(file)) fail(`connectors/${id}/connector.ts already exists`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, template({ id, name, category, auth, tier }));
  console.log(`created connectors/${id}/connector.ts`);
  console.log(`next: fill in the tagline and ifp_rules, then run 'dreameros-connectors validate'`);
}

function list(root) {
  const base = join(root, "connectors");
  const entries = readdirSync(base).filter((e) => {
    if (e.startsWith("_")) return false;
    return statSync(join(base, e)).isDirectory() && existsSync(join(base, e, "connector.ts"));
  });
  if (entries.length === 0) {
    console.log("no connectors yet. run 'dreameros-connectors scaffold <id>' to start one.");
    return;
  }
  console.log(`${entries.length} connector${entries.length === 1 ? "" : "s"}:`);
  for (const e of entries.sort()) console.log("  " + e);
}

function validate(root) {
  console.log("type-checking connectors against the schema (tsc --noEmit)...");
  const res = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
  if (res.status !== 0) fail("validation failed. fix the type errors above.");
  console.log("ok: every connector matches the schema.");
}

const [cmd, ...rest] = process.argv.slice(2);
const { flags, positional } = parseFlags(rest);

if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
  help();
  process.exit(0);
}
const root = findRepoRoot(process.cwd());
if (!root) fail("run this from inside a DreamerOS connectors checkout (the folder with connectors/ and packages/schema/).");

switch (cmd) {
  case "scaffold": scaffold(root, positional, flags); break;
  case "validate": validate(root); break;
  case "list": list(root); break;
  default: fail(`unknown command '${cmd}'. run 'dreameros-connectors help'.`);
}
