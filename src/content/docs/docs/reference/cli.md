---
title: CLI (oax)
description: Validate agent files and run them locally against recorded events.
sidebar:
  order: 2
---

```text
oax run <agents.md> --event <event.json> [options]
oax validate <agents.md>
oax --version
```

## `oax run` options

| Option | Meaning |
| --- | --- |
| `--event <file>` | CloudEvent or plain JSON payload (required). Plain JSON becomes an `io.openagentix.manual` event from `/sources/local/cli`. |
| `--mcp <file>` | JSON array of MCP server configurations (default: built-in demo servers) |
| `--providers <file>` | JSON array of provider configurations (default: `OAX_PROVIDERS` or `simulated`) |
| `--policy <file>` | JSON policy bundle applied on top of the agent file |
| `--prices <file>` | JSON price table for cost calculation |
| `--approve <all\|none>` | answer to approval requests (default `none`: reject) |
| `--json` | print each step and the result as JSON lines |

## Output

The text summary ends with:

```text
status=succeeded steps=7 toolCalls=2 tokens=1834/412 cost=$0.000000
audit: valid (12 entries, head 3f9a0c51d2e7)
```

With `--json`, each line is `{"type":"step","step":…}`, followed by
`{"type":"result","runId":…,"result":…,"audit":…}`.

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | success, or the file is valid |
| `1` | invalid file, or the run did not succeed |
| `2` | usage or other error |

## Environment

| Variable | Meaning |
| --- | --- |
| `OAX_PROVIDERS` | JSON array of provider configurations |
| `OAX_SECRET_<NAME>` | value of the secret reference `<name>` (upper-cased, non-alphanumerics as `_`) |
| `OAX_SECRETS_DIR` | directory with one file per secret reference, e.g. a mounted Kubernetes Secret |
