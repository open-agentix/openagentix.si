---
title: MCP and tool allowlists
description: Connect tools through the Model Context Protocol. Agents see only the tools they are granted, and every call passes the gate.
sidebar:
  order: 1
---

openagentix connects to tools through the **Model Context Protocol** with the official TypeScript
SDK. MCP servers are configured once; agents get access through grants in `agents.md`.

## Server configuration

```json
[
  {
    "name": "github",
    "transport": "stdio",
    "command": "/opt/mcp/github-mcp-server",
    "args": ["stdio"],
    "envSecrets": { "GITHUB_TOKEN": "github.token" },
    "timeoutMs": 30000,
    "maxResultBytes": 262144
  },
  {
    "name": "tickets",
    "transport": "streamable-http",
    "url": "https://mcp.internal.example/tickets",
    "headerSecrets": { "authorization": "tickets.auth" }
  }
]
```

| Field | Meaning | Default |
| --- | --- | --- |
| `transport` | `stdio` or `streamable-http` | |
| `command`, `args` | for `stdio`: a pinned binary; never `npx <package>@latest` | |
| `env`, `envSecrets` | environment for the server; only these plus a safe base set are passed | |
| `url`, `headers`, `headerSecrets` | for `streamable-http` | |
| `timeoutMs` | per call | 30000 |
| `maxResultBytes` | larger results are truncated with a marker | 262144 |
| `clearance` | highest data classification the server may receive | |

## Allowlists

The agent's `tools` list is its allowlist. The model is shown only the intersection of granted
tools and the tools the server offers, named `server__tool`. Every call is decided by the
[audit gate](/docs/concepts/audit-agent/) before it reaches the server; results are `ok`, `denied`
or `approval_required`.

```yaml
tools:
  - server: github
    tool: create_pull_request
    approval: required
    args:
      owner: { type: string, const: my-org }
      repo: { type: string, enum: [api, web] }
      base: { type: string, const: main }
```

## Errors

`tool_timeout`, `tool_failed`, `mcp_unknown_server`, `mcp_unavailable`.

## The policy gate as an MCP server

openagentix can expose an MCP server named `openagentix-gate` that offers only an agent's granted
tools and runs each call through the gate, audit and cost tracking. External harnesses are pointed
at this server instead of the real tools; see [External harnesses](/docs/integrations/harnesses/).

## Bring your own MCP

<span class="oax-badge oax-badge--next">Next release (0.2)</span>: MCP servers are connections scoped
to the platform, a tenant, a team or an agent (remote endpoints and stdio). <span class="oax-badge oax-badge--roadmap">Planned</span>: named read/write tool profiles (0.2); a catalog with review states, per-server egress rules and
MCP servers run as containers (0.3). Your own servers are first-class: the same gate, audit and cost tracking
apply as to any other tool.
