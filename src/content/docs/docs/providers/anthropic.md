---
title: Anthropic
description: Use Claude models through the Anthropic API.
sidebar:
  order: 5
---

```json
{ "kind": "anthropic", "name": "anthropic", "apiKeySecret": "anthropic.key" }
```

| Field | Meaning | Default |
| --- | --- | --- |
| `apiKeySecret` | secret reference for the API key | required |
| `baseUrl` | API base URL | `https://api.anthropic.com` |
| `defaultMaxTokens` | output token limit when the agent sets none | 16000 |
| `timeoutMs` | request timeout | 600000 |
| `maxRetries` | retries | 2 |

The default clearance is `internal`. To use Claude models inside your AWS account, use the
[Bedrock](/docs/providers/bedrock/) provider instead.
