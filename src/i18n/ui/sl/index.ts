import type { Dictionary } from '../en';
import type { DeepPartial } from '../../translate';

/**
 * Slovenian is prepared but not published yet (status `planned` in config.ts).
 * Every key missing here falls back to English.
 */
export const sl: DeepPartial<Dictionary> = {
  common: {
    skipToContent: 'Preskoči na vsebino',
    language: { label: 'Jezik' },
    footer: { imprint: 'Kolofon', privacy: 'Zasebnost' },
  },
};
