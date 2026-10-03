import { common } from './common';
import { landing } from './landing';
import { pages } from './pages';

/** English is the source dictionary; its shape defines the `Dictionary` type for all locales. */
export const en = { common, landing, pages };

export type Dictionary = typeof en;
