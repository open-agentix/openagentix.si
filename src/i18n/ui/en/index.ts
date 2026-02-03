import { common } from './common';

/** English is the source dictionary; its shape defines the `Dictionary` type for all locales. */
export const en = { common };

export type Dictionary = typeof en;
