// Builds the website for the demo host (demo.openagentix.si) as a small static site in dist-demo/.
// The demo page is the root page there; links to the rest of the site point to openagentix.si.
// Usage: pnpm build:demo
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DEMO_ORIGIN, pageMap, robotsTxt, transformDemoHtml } from './demo-transform.mjs';

const work = '.demo-build';
const out = 'dist-demo';

rmSync(work, { recursive: true, force: true });
rmSync(out, { recursive: true, force: true });

const build = spawnSync('pnpm', ['exec', 'astro', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, SITE_URL: DEMO_ORIGIN, OAX_OUT_DIR: work },
});
if (build.status !== 0) process.exit(build.status ?? 1);

mkdirSync(out, { recursive: true });
cpSync(join(work, '_astro'), join(out, '_astro'), { recursive: true });
if (existsSync(join(work, 'favicon.svg'))) cpSync(join(work, 'favicon.svg'), join(out, 'favicon.svg'));
for (const { from, to } of pageMap) {
  const target = join(out, to);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, transformDemoHtml(readFileSync(join(work, from), 'utf8')));
}
cpSync(join(work, '404.html'), join(out, '404.html'));
writeFileSync(join(out, 'robots.txt'), robotsTxt());
writeFileSync(join(out, 'CNAME'), 'demo.openagentix.si\n');
rmSync(work, { recursive: true, force: true });
console.log(`demo site written to ${out}/`);
