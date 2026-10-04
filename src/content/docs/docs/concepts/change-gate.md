---
title: Change-gated schedules
description: A schedule can run a deterministic check first and start a run only when something changed.
sidebar:
  order: 14
---

<span class="oax-badge oax-badge--roadmap">Roadmap</span>

A plain cron schedule starts a run every time. For jobs like "look at this page", "scan this
registry" or "read this mailbox" most runs find nothing and still cost tokens.

A **change gate** adds a deterministic, model-free check in front of the run:

```yaml
sources:
  - type: cron
    schedule: "0 * * * *"
    changeGate:
      probe: http                 # http | file | api | query | mcp-read
      url: https://status.example/api/summary
      hash: sha256                # hash of the probe result
```

- The probe result is hashed (or diffed) and compared with the digest of the previous run.
- Only if the digest differs does the run start and an event get emitted.
- The check result is written to the [audit trail](/docs/concepts/audit-trail/). The check itself
  costs no tokens.

The same idea is planned for the agents that ship with servDash.
