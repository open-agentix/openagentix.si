# openagentix.si

> **open-agentix – the agentic platform.** Built by agentix-zero, an AI agent. That is how much we
> trust our goal and vision.

Website and documentation of **openagentix**, the open-source, self-hostable agent platform: events
come in, agents act through MCP tools, every step is policy-checked, audited and cost-tracked, and
results go out as pull requests, ticket updates, messages, reports or metrics.

- Platform: [open-agentix/open-agentix](https://github.com/open-agentix/open-agentix)
- Helm chart: [open-agentix/open-agentix-helm](https://github.com/open-agentix/open-agentix-helm)
- Website and docs (this repository): [open-agentix/openagentix.si](https://github.com/open-agentix/openagentix.si)

agentix-zero is the project's agent account and writes most of this repository. Humans review every
change and own the decisions; the maintainer is Erik Weisser. See [GOVERNANCE.md](GOVERNANCE.md).

## What is in here

- **Landing page** (`/`, `/de/`): scroll-driven story of a run, from event to outcome, with an
  animated SVG flow diagram (Web Animations API, pauses on hover, static with reduced motion).
- **Docs** (`/docs/`): [Starlight](https://starlight.astro.build/), English first, German overview.
- **Demo placeholder** (`/demo/`): the live demo comes later on `demo.openagentix.si`.

Built with Astro 5 (static output), TypeScript and pnpm. No third-party requests: fonts, icons and
scripts are self-hosted, and a test checks every built file.

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

| Command | What it does |
| --- | --- |
| `pnpm check` | type and content checks (`astro check`) |
| `pnpm test` / `pnpm test:coverage` | unit tests (vitest), coverage gate 80 % |
| `pnpm build` | static build to `dist/` |
| `pnpm test:dist` | checks on `dist/`: no third-party requests, internal links, performance budget, hreflang |
| `pnpm lhci` | Lighthouse CI with the budgets in `lighthouserc.json` (uses a local Chrome; `CHROME_PATH`) |

Node.js 22 LTS is the target (20.19+ works). Astro is pinned to the 5.x line because Astro 6+
requires Node.js 22.12; the upgrade is a Dependabot pull request away once all build hosts run 22.

### Languages

English is the default (`/`), German lives under `/de/`. On the first visit a tiny script picks the
browser language once per session (never for bots), and the switcher remembers an explicit choice
(localStorage, cookie fallback). Every page has `hreflang` alternates and `x-default`. Slovenian is
prepared in `src/i18n/ui/sl/` and falls back to English until it is published.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md): DCO sign-off, Conventional Commits, SemVer, small commits
with tests. Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and report security issues as
described in [SECURITY.md](SECURITY.md).

## Licence

- Website source code: [Apache-2.0](LICENSE)
- Documentation content (`src/content/docs`): [CC BY 4.0](LICENSE-docs)
- Fonts: Geist and Geist Mono, [SIL OFL 1.1](src/assets/fonts/OFL-Geist.txt)
