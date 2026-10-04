import type { Dictionary } from '../en';

export const pages: Dictionary['pages'] = {
  demo: {
    title: 'Live-Demo',
    metaTitle: 'Live-Demo – openagentix',
    description: 'Eine öffentliche openagentix-Demo mit Beispieldaten und simuliertem Modell: ein festes Szenario starten, dem Lauf zusehen und die Audit-Kette prüfen.',
    eyebrow: 'Live-Demo',
    heading: 'Live-Demo ausprobieren: Szenario starten und dem Lauf folgen.',
    lead: 'Die öffentliche Demo ist eine laufende openagentix-Instanz mit geführter Tour. Ein festes Szenario starten, Agenten bei der Arbeit zusehen, Gates entscheiden sehen und den Audit-Trail wachsen lassen. Sie nutzt Beispieldaten und das simulierte Modell: keine Modellkosten, keine Aufrufe nach außen. Die API ist schreibgeschützt, freier Text ist nicht möglich.',
    stepsTitle: 'So funktioniert es',
    steps: [
      { title: 'Szenario starten', body: 'Mit dem gemeinsamen Demo-Konto von der Anmeldeseite einloggen und eines der festen CVE-Triage-Szenarien wählen.' },
      { title: 'Lauf verfolgen', body: 'Jeden Schritt live sehen: Modellaufrufe, Tool-Aufrufe, Gate-Entscheidungen und Kosten.' },
      { title: 'Kette prüfen', body: 'Die Audit-Ansicht öffnen und die Hashkette verifiziert sehen.' },
    ],
    open: 'Live-Demo öffnen',
    note: 'Die Demo zeigt den aktuellen Entwicklungsstand und kann jederzeit zurückgesetzt werden. Für eigene Agenten openagentix lokal mit Docker Compose starten.',
    cta: 'Lokal starten',
  },
};
