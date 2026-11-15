# openagentix.si

The OpenAgentix website brings together independently maintained projects, including OpenGlassUI, Awesome OpenCode and the archived, source-available Open Model Prism. Each project retains its own repository, license and maintenance status.

The site and its documentation are built with Astro. News and articles live in the separate `weisser-dev/blog.openagentix.si` repository; their existing publication schedule and URLs are preserved. The homepage displays a snapshot of the four most recent published articles, refreshed by the website build from the public blog feed.

Changes follow the repository's review process described in [governance](GOVERNANCE.md).

## What is in here

- **Collection homepage** (`/`, `/de/`): project status, links, and the four latest published news articles.
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

Node.js 22.12+ is required (22 and 24 LTS are tested in CI). Astro 7 and Vitest 5 dropped Node.js 20.

### Languages

English is the default (`/`), German lives under `/de/`. On the first visit a tiny script picks the
browser language once per session (never for bots), and the switcher remembers an explicit choice
(localStorage, cookie fallback). Every page has `hreflang` alternates and `x-default`. Slovenian is
prepared in `src/i18n/ui/sl/` and falls back to English until it is published.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md): DCO sign-off, Conventional Commits, SemVer, small commits
with tests. Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and report security issues as
described in [SECURITY.md](SECURITY.md).

Questions and discussion: [GitHub Discussions](https://github.com/weisser-dev/openagentix.si/discussions),
[Issues](https://github.com/weisser-dev/openagentix.si/issues) or info@openagentix.si.

## Licence

- Website source code: [Apache-2.0](LICENSE)
- Documentation content (`src/content/docs`): [CC BY 4.0](LICENSE-docs)
- Fonts: Geist and Geist Mono, [SIL OFL 1.1](src/assets/fonts/OFL-Geist.txt)
