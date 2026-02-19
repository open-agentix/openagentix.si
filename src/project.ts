/** Project-wide constants. Repository names follow SPEC.md (renamed 2026-10-03). */
export const SITE_URL = 'https://openagentix.si';
export const GITHUB_ORG = 'https://github.com/open-agentix';

export const repos = {
  platform: { name: 'open-agentix', url: `${GITHUB_ORG}/open-agentix` },
  helm: { name: 'open-agentix-helm', url: `${GITHUB_ORG}/open-agentix-helm` },
  website: { name: 'openagentix.si', url: `${GITHUB_ORG}/openagentix.si` },
} as const;
