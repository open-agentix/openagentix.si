import { initLanguageSwitchers } from './switcher';
import { initMenu, initThemeToggle } from './theme';

export function initSite(doc: Document, win: Window): void {
  initLanguageSwitchers(doc, win);
  initThemeToggle(doc, win);
  initMenu(doc, win);
}
