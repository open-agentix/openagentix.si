---
title: Governance
description: Who decides what in openagentix, how decisions are recorded, and how an AI agent fits in.
sidebar:
  order: 3
---

This is a summary; the full text is `GOVERNANCE.md` in the
[platform repository](https://github.com/open-agentix/open-agentix).

## Built by an agent

**open-agentix – the agentic platform. Built by agentix-zero, an AI agent. That is how much we trust
our goal and vision.**

agentix-zero is the project's agent account. It writes most of the code, tests and documentation.
It has no decision rights of its own; maintainers own the roadmap, the architecture decisions,
releases and security handling. The project lead acts as the maintainer of this repository.

## How changes are reviewed

The platform is built mostly by AI agents under the maintainer's direction.

- Pull requests are authored by agents (the implementation model).
- A second, independent review agent (a stronger model) reviews each pull request. For
  security-relevant changes this is a dedicated adversarial security review with a fix round and
  real test runs.
- The lead agent merges (squash merge) under the maintainer's standing authorisation.
- There is **no guarantee that a human reads every change before it is merged.**
- The maintainer sets the direction, answers design questions, can inspect, revert and block
  changes at any time, and decides on releases.
- External contributions from people are reviewed by the maintainer.

Requiring a human approval for sensitive paths (for example authentication, tenancy, runners and
migrations) through `CODEOWNERS` and branch protection is possible and planned as an optional
governance setting. It is not enforced today.

This is about how the project is developed. The runtime approval of agent actions (approval steps
in `agents.md`) is a separate product feature and is unchanged.

**How to verify:** the pull request history shows who authored, reviewed and merged each change and
keeps the review comments; the [ADRs](https://github.com/open-agentix/open-agentix/tree/main/docs/adr)
record the significant decisions; the [changelog](https://github.com/open-agentix/open-agentix/blob/main/CHANGELOG.md) lists what shipped in each release.

## Roles

- **Users** run openagentix and report issues.
- **Contributors** send pull requests, reviews, docs and ideas.
- **Maintainers** set the direction, review contributions from people, cut releases and steward the roadmap. A contributor with a
  track record of substantial contributions over at least three months can be nominated; the
  nomination passes by lazy consensus after seven days.

## Decisions

- Everyday decisions happen in pull requests (see above); one approval is enough.
- **Significant decisions** (architecture, security model, breaking API changes, new runtime
  dependencies with network access, licensing) need an **Architecture Decision Record** in
  `docs/adr/`, open for discussion for at least five working days and accepted by lazy consensus.
  Accepted ADRs are immutable; a later ADR can supersede one.

## Licences

Code is licensed under Apache-2.0. The documentation on this site is licensed under CC BY 4.0.

## Conduct and security

All participants follow the Contributor Covenant 2.1. Security issues are reported privately
through GitHub's private vulnerability reporting ("Report a vulnerability"), never by e-mail.
Questions and discussion belong in [GitHub Discussions](https://github.com/open-agentix/open-agentix/discussions)
and [Issues](https://github.com/open-agentix/open-agentix/issues); the general contact is info@openagentix.si.
