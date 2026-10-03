import { defaultLocale, type Locale } from './config';
import { en, type Dictionary } from './ui/en';
import { de } from './ui/de';
import { sl } from './ui/sl';

export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Deep-merges `override` onto `base`. Arrays and primitives are replaced as a whole. */
export function deepMerge<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override as T;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    out[key] = deepMerge((base as Record<string, unknown>)[key], value as never);
  }
  return out as T;
}

const partials: Record<Locale, DeepPartial<Dictionary>> = { en, de, sl };

/** Dictionary for a locale, with English as fallback for missing keys. */
export function getDictionary(locale: Locale): Dictionary {
  if (locale === defaultLocale) return en;
  return deepMerge(en, partials[locale]);
}

/** Replaces `{name}` placeholders. Unknown placeholders are left untouched. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Lists all leaf key paths of a dictionary, e.g. `common.nav.docs`. Used to check translation parity. */
export function leafPaths(value: unknown, prefix = ''): string[] {
  if (!isPlainObject(value)) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}
