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
It has no decision rights of its own: every change is reviewed by a human maintainer, and
maintainers own the roadmap, the architecture decisions, releases and security handling. The
maintainer and project lead is the project lead.

## Roles

- **Users** run openagentix and report issues.
- **Contributors** send pull requests, reviews, docs and ideas.
- **Maintainers** review and merge, cut releases and steward the roadmap. A contributor with a
  track record of substantial contributions over at least three months can be nominated; the
  nomination passes by lazy consensus after seven days.

## Decisions

- Everyday decisions happen in pull requests; one maintainer approval is enough.
- **Significant decisions** (architecture, security model, breaking API changes, new runtime
  dependencies with network access, licensing) need an **Architecture Decision Record** in
  `docs/adr/`, open for discussion for at least five working days and accepted by lazy consensus.
  Accepted ADRs are immutable; a later ADR can supersede one.

## Licences

Code is licensed under Apache-2.0. The documentation on this site is licensed under CC BY 4.0.

## Conduct and security

All participants follow the Contributor Covenant 2.1. Security issues are reported privately
through GitHub security advisories.
