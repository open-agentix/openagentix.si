import { isLiveLocale } from '../i18n/config';
import { browserEnv, writePreference } from '../i18n/preference';
import { localeFromPath } from '../i18n/routes';

export const SWITCH_SELECTOR = '[data-lang-switch] a[data-locale]';
export const DOCS_SELECT_SELECTOR = 'starlight-lang-select select';

/**
 * Remembers the language whenever the visitor uses a switcher: the links in the site header and
 * Starlight's language select in the docs. Navigation itself stays plain HTML, so it works without JS.
 * Returns the number of controls that were wired up.
 */
export function initLanguageSwitchers(root: ParentNode, win: Window): number {
  let count = 0;
  const remember = (value: string | null | undefined) => {
    if (isLiveLocale(value)) writePreference(value, browserEnv(win));
  };

  root.querySelectorAll<HTMLAnchorElement>(SWITCH_SELECTOR).forEach((link) => {
    link.addEventListener('click', () => remember(link.dataset['locale']));
    count += 1;
  });

  root.querySelectorAll<HTMLSelectElement>(DOCS_SELECT_SELECTOR).forEach((select) => {
    select.addEventListener('change', () => remember(localeFromPath(select.value)));
    count += 1;
  });

  return count;
}
