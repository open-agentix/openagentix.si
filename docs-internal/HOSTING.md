# Hosting on GitHub

The website is a static site (Astro). The open-source project can run completely on GitHub: the
site on GitHub Pages, the blog and the demo in their own repositories. This file lists the exact
steps. The workflow and the build targets are in the repository; the switches below are repository
settings and DNS records that a maintainer sets once.

## 1. Main site: openagentix.si

Workflow: `.github/workflows/pages.yml` (build with pnpm, `pnpm test:dist`, then
`actions/upload-pages-artifact` and `actions/deploy-pages`, all actions pinned by commit SHA).
It runs on every push to `main` and on demand.

Steps (maintainer, once):

1. Repository settings > Pages > **Build and deployment > Source: GitHub Actions**.
2. Re-run the workflow "Deploy to GitHub Pages" (or push to `main`). The first run creates the
   `github-pages` environment.
3. Settings > Pages > **Custom domain**: `openagentix.si`, then enable **Enforce HTTPS** when the
   certificate is issued. (`public/CNAME` contains the same domain; with the Actions source it is
   informational, but it keeps a branch-based deployment working as a fallback.)
4. Optional but recommended: verify the domain for the organisation (Organization settings >
   Pages > Add a domain) so nobody else can claim it.
5. DNS (done by the maintainer in the DNS provider, not by the workflow):

   | Name | Type | Value |
   | --- | --- | --- |
   | `openagentix.si` | `A` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
   | `openagentix.si` | `AAAA` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
   | `www` | `CNAME` | `open-agentix.github.io` |

   Check the current addresses in the GitHub documentation before changing DNS.

The site must stay indexable: there is no `noindex` meta tag or header, and `robots.txt` allows
everything. Keep it that way.

## 2. Redirects: `www.openagentix.si`, `openagentix.de`

GitHub Pages serves one custom domain per site. Redirects are therefore done outside the site:

- `www.openagentix.si`: with the `CNAME` record above, GitHub redirects `www` to the apex domain
  automatically once the apex is the configured custom domain.
- `openagentix.de` (and `www.openagentix.de`): a permanent (301) redirect to
  `https://openagentix.si/` at the DNS/registrar level (URL forwarding) or at an edge proxy. A
  redirect page inside the site would only be an HTML meta refresh and is not used.

## 3. Demo: `demo.openagentix.si`

A repository has a single Pages site, so the demo needs its own host. For now it is a static page
built from this repository:

```sh
pnpm install --frozen-lockfile
pnpm build:demo        # writes dist-demo/ (demo page as root, /de/ for German, CNAME, robots.txt)
```

`dist-demo/` is the complete site. Links to the rest of the website point to
`https://openagentix.si`. The workflow also uploads `dist-demo/` as the artifact `demo-site` on
every run.

Options to publish it (maintainer decides):

1. Create a repository `open-agentix/demo.openagentix.si`, put the content of `dist-demo/` on its
   Pages branch or deploy it with `actions/deploy-pages` from a small workflow, set the custom
   domain `demo.openagentix.si` and add `demo` as `CNAME` to `open-agentix.github.io`.
2. Serve the artifact from any static host.

When the live demo with a backend exists, it replaces this static page; the link in the website
(`demo.openagentix.si`) stays the same.

## 4. Blog: `blog.openagentix.si`

The blog lives in its own repository (`open-agentix/blog.openagentix.si`) with its own Pages site
and custom domain. The website only links to it and never loads anything from it.

## 5. Privacy

The site sets no cookies and makes no third-party requests (checked by `pnpm test:dist`). It has no
imprint or privacy page because it collects no personal data. GitHub Pages itself logs requests
as a hosting provider; this is outside the control of the site.
