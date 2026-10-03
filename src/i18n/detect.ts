import { defaultLocale, liveLocales, type Locale } from './config';
import { matchPath, pathFor } from './routes';

/** Lower-cased primary subtags in preference order, duplicates removed (`de-AT` -> `de`). */
export function primaryLanguages(languages: readonly string[]): string[] {
  const out: string[] = [];
  for (const tag of languages) {
    const primary = tag.trim().toLowerCase().split(/[-_]/)[0];
    if (primary && primary !== '*' && !out.includes(primary)) out.push(primary);
  }
  return out;
}

/** Picks the first browser language the site supports, otherwise the default locale. */
export function negotiate(
  languages: readonly string[],
  supported: readonly Locale[] = liveLocales,
): Locale {
  for (const primary of primaryLanguages(languages)) {
    const hit = supported.find((l) => l === primary);
    if (hit) return hit;
  }
  return defaultLocale;
}

/** Crawlers, link unfurlers, audit tools and automated browsers are never redirected. */
const BOT_PATTERN =
  /bot\b|bot\/|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|preview|lighthouse|pagespeed|headless|phantomjs|puppeteer|playwright|selenium|curl|wget|python-requests|httpclient|validator/i;

export function isBot(userAgent: string, webdriver = false): boolean {
  return webdriver || userAgent.trim() === '' || BOT_PATTERN.test(userAgent);
}

export interface RedirectInput {
  pathname: string;
  search?: string;
  hash?: string;
  /** Language the visitor picked in the switcher earlier, if any. */
  saved: Locale | null;
  /** `navigator.languages`. */
  languages: readonly string[];
  userAgent: string;
  webdriver?: boolean;
  /** True once detection already ran in this browser session. */
  alreadyDetected: boolean;
}

/**
 * Where to send the visitor, or `null` to stay.
 * - A saved choice always wins (it was made explicitly).
 * - Without a saved choice, the browser language is only applied once per session and only on
 *   default-locale pages, so explicitly shared localised links are respected.
 * - Bots are never redirected.
 */
export function redirectTarget(input: RedirectInput): string | null {
  if (isBot(input.userAgent, input.webdriver)) return null;
  const current = matchPath(input.pathname);
  if (!current) return null;

  let desired: Locale | null = input.saved;
  if (!desired && !input.alreadyDetected && current.locale === defaultLocale) {
    desired = negotiate(input.languages);
  }
  if (!desired || desired === current.locale || !liveLocales.includes(desired)) return null;
  return `${pathFor(current.page, desired)}${input.search ?? ''}${input.hash ?? ''}`;
}
