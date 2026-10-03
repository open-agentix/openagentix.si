---
title: OpenAI-compatible
description: OpenAI, Azure OpenAI, vLLM, LM Studio and any server with the chat completions API.
sidebar:
  order: 2
---

```json
{
  "kind": "openai",
  "name": "openai",
  "baseUrl": "https://api.openai.com/v1",
  "apiKeySecret": "openai.key"
}
```

| Field | Meaning |
| --- | --- |
| `baseUrl` | required; requests go to `<baseUrl>/chat/completions` |
| `apiKeySecret` | secret reference, sent as `authorization: Bearer …` |
| `headers` | extra static headers |
| `headerSecrets` | header name to secret reference, e.g. Azure's `api-key` |
| `query` | query parameters, e.g. Azure's `api-version` |

## Azure OpenAI

```json
{
  "kind": "openai",
  "name": "azure",
  "baseUrl": "https://my-resource.openai.azure.com/openai/deployments/gpt-4o",
  "headerSecrets": { "api-key": "azure.openai.key" },
  "query": { "api-version": "2024-10-21" }
}
```

## vLLM and LM Studio

Point `baseUrl` at the server's OpenAI-compatible endpoint, for example
`http://vllm:8000/v1`. If the server needs no key, leave out `apiKeySecret`. Raise the
`clearance` to `confidential` or `restricted` for models that run on your own hardware.
