// Pure helpers that turn the rendered demo pages of the website into a standalone site for
// demo.openagentix.si. Kept free of file access so they can be unit-tested.
export const DEMO_ORIGIN = 'https://demo.openagentix.si';
export const MAIN_ORIGIN = 'https://openagentix.si';

/** Where each rendered demo page lands on the demo host. */
export const pageMap = [
  { from: 'demo/index.html', to: 'index.html' },
  { from: 'de/demo/index.html', to: 'de/index.html' },
];

const demoPaths = new Map([
  ['/demo/', '/'],
  ['/de/demo/', '/de/'],
]);

// Root-relative files that are shipped with the demo site itself.
const local = /^\/(?:_astro\/|favicon\.svg$|robots\.txt$)/;

/** Rewrites one root-relative URL: demo pages move to the host root, everything else points to the main site. */
export function rewritePath(path) {
  if (local.test(path)) return path;
  const [pathname, rest = ''] = splitSuffix(path);
  const demo = demoPaths.get(pathname);
  if (demo) return demo + rest;
  return MAIN_ORIGIN + path;
}

function splitSuffix(path) {
  const i = path.search(/[?#]/);
  return i === -1 ? [path, ''] : [path.slice(0, i), path.slice(i)];
}

/** Rewrites href values and absolute self-references (canonical, hreflang, og:url) of a demo page. */
export function transformDemoHtml(html) {
  let out = html.replace(/(\shref=)(["'])(\/(?!\/)[^"']*)\2/g, (_m, attr, quote, path) => `${attr}${quote}${rewritePath(path)}${quote}`);
  out = out.replace(/<link rel="sitemap"[^>]*>/g, '');
  out = out.replace(/https:\/\/demo\.openagentix\.si(\/de)?\/demo\//g, (_m, de) => `${DEMO_ORIGIN}${de ?? ''}/`);
  return out;
}

export function robotsTxt() {
  return 'User-agent: *\nAllow: /\n';
}
