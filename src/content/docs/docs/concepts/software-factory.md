---
title: Dark software factory
description: An opt-in mode where agents build software from spec to pull request with minimal human touch.
sidebar:
  order: 15
---

<span class="oax-badge oax-badge--available">Available in 0.1</span>: the opt-in `mode: dark-factory` with the fixed notice in validation output. <span class="oax-badge oax-badge--roadmap">Planned</span>: the notice in the console and a ready-made spec → code → tests → pull request template (0.4).

In **dark software factory** mode, agents take a task end to end: specification, code, tests and a
pull request, with minimal human involvement.

> **Recommended for MVP and proof-of-concept development only. Not for production changes without
> review.**

The recommendation is part of the product: it is shown in the console, in the docs and in the CLI
whenever the mode is switched on.

## What stays in place

- Production-grade pipelines keep their **approval gates**: a merge or a deploy needs a person or
  an explicit policy.
- Every step is still policy-checked, audited and cost-tracked.
- The mode is opt-in per agent or tenant and off by default.
- [Development guidelines](/docs/concepts/guidelines/) apply to factory agents like to any other
  development agent.
