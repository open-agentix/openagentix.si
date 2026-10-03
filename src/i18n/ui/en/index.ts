import { common } from './common';
import { landing } from './landing';

/** English is the source dictionary; its shape defines the `Dictionary` type for all locales. */
export const en = { common, landing };

export type Dictionary = typeof en;
