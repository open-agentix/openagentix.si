/** Project-wide constants. Repository names follow SPEC.md (renamed 2026-10-03). */
export const SITE_URL = 'https://openagentix.si';
/** The blog lives in its own repository and is served from its own subdomain. */
export const BLOG_URL = 'https://blog.openagentix.si/';
/** Hosts that belong to the project: allowed as link targets and in the no-third-party scan. */
export const OWN_HOSTS = ['openagentix.si', 'www.openagentix.si', 'demo.openagentix.si', 'blog.openagentix.si'] as const;
export const GITHUB_ORG = 'https://github.com/open-agentix';

export const repos = {
  platform: { name: 'open-agentix', url: `${GITHUB_ORG}/open-agentix` },
  helm: { name: 'open-agentix-helm', url: `${GITHUB_ORG}/open-agentix-helm` },
  website: { name: 'openagentix.si', url: `${GITHUB_ORG}/openagentix.si` },
} as const;
