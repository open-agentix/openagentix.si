---
title: Air-gapped mode
description: Run openagentix without any outbound connection to the internet.
sidebar:
  order: 17
---

openagentix never loads prompts, skills, plugins or telemetry from the internet, and it never
fetches the model catalog at run time. Outbound traffic goes only to the providers and tools you
configure.

For a fully air-gapped installation:

1. Use local models, for example through the [Ollama provider](/docs/providers/ollama/), or an
   OpenAI-compatible server inside your network.
2. Register only MCP servers that run inside your network (see
   [MCP](/docs/integrations/mcp/)).
3. Mirror container images and the Helm chart into your own registry.
4. Use the pinned model catalog snapshot that ships with the release (see
   [your keys, your models](/docs/concepts/models-and-keys/)); local overrides cover private models.

The [egress allowlist](/docs/security/model/) of each worker applies in this mode as well.
