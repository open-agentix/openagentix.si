# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Agent lifecycle governance (four-eyes publish approval with review comments, development vs
  published agents, encrypted personal, team and tenant secrets, Vault and AWS Secrets Manager
  backends) is shown as planned on the landing page (English and German), the roadmap and the
  security model, with what exists today stated next to it. Nothing of it is built yet (ADR 0017).
- Build toolchain upgraded to Astro 7, Starlight 0.42 and Vitest 5. Building the site now requires
  Node.js 22.12 or newer (Node.js 20 is dropped; CI covers 22 and 24).
- Landing page and docs (English and German) state what exists: the architecture scene is marked
  as the 0.2 target design, planned items (spawned workers, signed toolbox images, egress
  allowlist, per-step secrets, model second opinion, PDF reports, test and promotion gates) are
  labelled as planned, Teams is described as an event source through a webhook, and the change gate
  names only HTTP and file probes.
- The German site matches the English wording.
- `main` state of the platform (typed handovers, tool profiles, Agent Check and Agent Plan, Kubernetes
  Job runner building block, OpenCode adapter, Claude Code harness) replaces "planned" and "stub".
- The demo page and buttons point to the live demo at `demo.openagentix.si`.
- Getting started and the Helm page use the real files and commands; the unpublished API image is
  stated.
- The static "passed" badges in the "built by an agent" section are removed.
- Honesty fixes (English and German): the roadmap states that 0.1 was tagged `v0.1.0` on 2026-10-04
  (built from source, no release images yet) and is a summary of `ROADMAP.md`; the container runner
  and credential broker are shown as on `main`, opt-in; the Claude Code verification is scoped to the
  in-process path; the pre-merge review is described as an independent agent review; the pre-run
  check claim names tool calls; the business-user workflow is an Agent Plan, not a dialog; extra
  change-gate probes are planned, not built; OpenAI-compatible provider families and all four example
  agents are named.

## [0.1.0] - 2026-08-11

First version of the openagentix website and documentation.

### Added

- Landing page in English (`/`) and German (`/de/`) with a scroll-driven story: animated hero
  diagram (events in, agents with per-agent audit gates and a global control agent, results out),
  pinned "how it works" scene with a camera over the diagram, control node and worker node scene,
  console reveal, personas, features, runners with MVP/roadmap badges and optional harnesses,
  enterprise trust (real SHA-256 audit chain, RBAC matrix, costs), use cases, a "built by an
  agent" scene with the project tagline, open source and roadmap teaser.
- Internationalisation: translation files for all copy, browser-language detection on the first
  visit (once per session, never for bots), a language switcher that remembers the choice
  (localStorage with cookie fallback), `hreflang` and `x-default` links, Slovenian prepared with
  English fallback.
- Documentation with Starlight, English first with a German overview: getting started, concepts
  (control node and workers, toolbox images, runners, events, agents.md, runs, audit gate, control
  agent, RBAC, audit trail, costs, metrics), agents.md and CLI reference, API reference
  placeholder, event sources, providers including Bedrock via VPC endpoint, proxy and IRSA, MCP
  allowlists, external harnesses, security model, Helm/Kubernetes/EKS, mirrored roadmap,
  contributing and governance.
- Imprint and privacy policy in English and German; live demo placeholder; bilingual 404 page.
- Quality gates: unit tests with an 80 % coverage gate, a scan of the build for third-party
  requests, an internal link and anchor checker, a performance budget for the landing pages,
  hreflang checks and Lighthouse CI budgets.
- Repository hygiene: Apache-2.0 for code, CC BY 4.0 for docs, contributing guide (DCO,
  Conventional Commits, SemVer), Code of Conduct, security policy, governance, issue and pull
  request templates, GitHub Actions CI pinned by commit SHA, Dependabot.

[Unreleased]: https://github.com/open-agentix/openagentix.si/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/open-agentix/openagentix.si/releases/tag/v0.1.0
