---
title: Providers overview
description: Configure model providers once and refer to them by name from agents. Every provider has an egress guard and a data clearance.
sidebar:
  order: 1
---

Providers are configured as a JSON array, through `OAX_PROVIDERS` or the CLI's `--providers` file.
Agents refer to them by `name`. Without configuration, a single `simulated` provider is available.

```json
[
  { "kind": "openai", "name": "openai", "baseUrl": "https://api.openai.com/v1", "apiKeySecret": "openai.key" },
  { "kind": "ollama", "name": "local", "baseUrl": "http://ollama:11434" },
  { "kind": "bedrock", "name": "bedrock", "region": "eu-central-1" },
  { "kind": "simulated", "name": "simulated" }
]
```

## Common fields

| Field | Meaning |
| --- | --- |
| `kind` | `openai`, `ollama`, `anthropic`, `bedrock`, `simulated` |
| `name` | slug used in `agents.md` |
| `clearance` | highest data classification this provider may receive |
| `proxyUrl` | HTTPS proxy for outbound requests |
| `timeoutMs` | request timeout |
| `maxRetries` | 0 to 10 retries on 429, 5xx and network errors |

## Data clearance

Each provider has a clearance. Before the first model call, the run's classification is compared
with it; if the data is more sensitive, the run ends as `blocked_by_policy`.

| Kind | Default clearance |
| --- | --- |
| `simulated`, `ollama` | `restricted` |
| `bedrock` | `confidential` |
| `openai`, `anthropic` | `internal` |

## Egress guard

HTTP providers may only contact the origin of their configured base URL. A request anywhere else is
refused with `egress_denied`. Combine this with network policies for defence in depth.

## Pages

- [OpenAI-compatible](/docs/providers/openai-compatible/) (OpenAI, Azure OpenAI, vLLM, LM Studio)
- [Ollama](/docs/providers/ollama/)
- [AWS Bedrock](/docs/providers/bedrock/) (VPC endpoints, proxy, IRSA)
- [Anthropic](/docs/providers/anthropic/)
- [Simulated](/docs/providers/simulated/)
