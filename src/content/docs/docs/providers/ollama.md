---
title: Ollama
description: Run local models with Ollama; the default clearance is restricted because data stays on your hardware.
sidebar:
  order: 3
---

```json
{ "kind": "ollama", "name": "local", "baseUrl": "http://ollama:11434" }
```

`baseUrl` defaults to `http://localhost:11434`; requests go to `/api/chat`. The default clearance is
`restricted`: data never leaves your infrastructure. Ollama models cost nothing in the
[price table](/docs/concepts/costs/).

```yaml
agents:
  - id: summariser
    provider: local
    model: llama3.1:8b
```
