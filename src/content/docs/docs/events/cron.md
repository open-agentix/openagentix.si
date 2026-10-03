---
title: Cron (schedules)
description: Start runs on a schedule with cron expressions and time zones.
sidebar:
  order: 3
---

```yaml
triggers:
  - type: cron
    schedule: "0 3 * * *"      # every night at 03:00
    timezone: Europe/Berlin
```

- Expressions have five fields, or six with seconds.
- Without `timezone`, the server time zone applies.
- If a run of the same schedule is still active, the next tick is skipped instead of piling up.
- Each tick creates an `io.openagentix.cron.tick` event with `subject` set to the schedule and
  `data: { schedule, scheduledAt }`.

An invalid expression is rejected with `cron_invalid`.
