// Sidebar for the Starlight docs. Groups are generated from folders below src/content/docs/docs.
/** @param {string} label @param {string} de @param {string} directory */
const group = (label, de, directory) => ({
  label,
  translations: { de },
  items: [{ autogenerate: { directory } }],
});

export const docsSidebar = [
  { label: 'Overview', translations: { de: 'Überblick' }, link: '/docs/' },
  group('Start here', 'Erste Schritte', 'docs/start'),
  group('Concepts', 'Konzepte', 'docs/concepts'),
  group('Reference', 'Referenz', 'docs/reference'),
  group('Events', 'Ereignisse', 'docs/events'),
  group('Providers', 'Provider', 'docs/providers'),
  group('Integrations', 'Integrationen', 'docs/integrations'),
  group('Security', 'Sicherheit', 'docs/security'),
  group('Deploy', 'Betrieb', 'docs/deploy'),
  group('Project', 'Projekt', 'docs/project'),
];
