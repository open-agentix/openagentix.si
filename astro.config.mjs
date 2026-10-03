// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import { docsSidebar } from './src/docs-sidebar.mjs';

// Canonical origin used for canonical URLs, hreflang links and the sitemap.
const site = process.env.SITE_URL ?? 'https://openagentix.de';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  // The site ships SVG and CSS artwork only; no raster processing is needed at build time.
  image: { service: passthroughImageService() },
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    starlight({
      title: 'openagentix docs',
      description: 'Documentation for openagentix, the open-source, self-hostable agent platform.',
      logo: { src: './src/assets/logo-mark.svg', alt: 'openagentix' },
      favicon: '/favicon.svg',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        de: { label: 'Deutsch', lang: 'de' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/open-agentix' },
      ],
      editLink: { baseUrl: 'https://github.com/open-agentix/website/edit/main/' },
      lastUpdated: false,
      disable404Route: true,
      customCss: ['./src/styles/fonts.css', './src/styles/starlight.css'],
      components: {
        LanguageSelect: './src/components/docs/LanguageSelect.astro',
      },
      sidebar: docsSidebar,
    }),
  ],
});
