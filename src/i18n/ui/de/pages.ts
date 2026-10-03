import type { Dictionary } from '../en';

export const pages: Dictionary['pages'] = {
  legal: {
    updated: 'Stand: {date}',
  },
  demo: {
    title: 'Live-Demo',
    metaTitle: 'Live-Demo – openagentix',
    description: 'Bald gibt es eine öffentliche Demo von openagentix: Ereignis per curl oder E-Mail auslösen und dem Lauf zusehen.',
    eyebrow: 'Bald verfügbar',
    heading: 'Live-Demo bald verfügbar: Ereignis per curl oder E-Mail auslösen.',
    lead: 'Bald können Sie einen echten Lauf gegen eine öffentliche Demo-Instanz starten. Ereignis senden, Agenten bei der Arbeit zusehen, Gates entscheiden sehen und den Audit-Trail wachsen lassen. Die Demo nutzt den simulierten Provider: keine Modellkosten, keine Aufrufe nach außen.',
    stepsTitle: 'So wird es funktionieren',
    steps: [
      { title: 'Ereignis senden', body: 'Ein kleines JSON per curl schicken oder eine E-Mail an die Demo-Adresse senden.' },
      { title: 'Lauf verfolgen', body: 'Jeden Schritt live sehen: Modellaufrufe, Tool-Aufrufe, Gate-Entscheidungen und Kosten.' },
      { title: 'Kette prüfen', body: 'Die Audit-Einträge herunterladen und die Hashkette selbst prüfen.' },
    ],
    curlLabel: 'Beispiel (noch nicht live)',
    mail: 'Die E-Mail-Adresse veröffentlichen wir hier, sobald die Demo online ist.',
    note: 'Diese Seite spricht noch mit keinem Backend. Bis dahin openagentix einfach lokal mit Docker Compose starten.',
    cta: 'Lokal starten',
  },
};
