# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-10-03

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
