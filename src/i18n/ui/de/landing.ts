import type { Dictionary } from '../en';

export const landing: Dictionary['landing'] = {
  meta: {
    title: 'openagentix – die Open-Source-Agentenplattform mit lückenlosem Audit',
    description:
      'Selbst gehostete Agentenplattform: Ereignisse starten Läufe, Agenten arbeiten über MCP-Tools, und jeder Aufruf wird vorab geprüft, protokolliert und mit Kosten erfasst. Apache-2.0.',
  },
  hero: {
    eyebrow: 'Open Source · Apache-2.0 · Selbst gehostet',
    titleA: 'Agenten bei der Arbeit.',
    titleB: 'Jeder Schritt nachvollziehbar.',
    lead: 'openagentix macht aus Ereignissen erledigte Arbeit. Ein Webhook, eine Kafka-Nachricht, eine E-Mail oder ein Zeitplan startet einen Lauf. Agenten handeln über MCP-Tools. Jeder Aufruf wird vor der Ausführung geprüft, fälschungssicher protokolliert und auf den Cent genau abgerechnet.',
    ctaDocs: 'Zur Doku',
    ctaGithub: 'Auf GitHub ansehen',
    ctaDemo: 'Live-Demo: bald verfügbar',
    scrollHint: 'Weiterscrollen und einem Lauf folgen',
  },
  diagram: {
    title: 'So läuft ein Lauf durch openagentix',
    description:
      'Ereignisse aus Kafka, Webhooks, Streams, E-Mail, Microsoft Teams und Cron kommen links in die Plattform. Darin reichen ein bis drei Agenten die Arbeit weiter. Jeder Tool-Aufruf passiert zuerst das Audit-Gate des Agenten, ein globaler Kontroll-Agent überwacht Budgets und Leitplanken, und jeder Schritt landet in einem per Hash verketteten Audit-Trail. Rechts verlassen die Ergebnisse die Plattform: Pull Requests, behobene CVEs, aktualisierte Tickets, Chat-Nachrichten, Berichte und Metriken.',
    pause: 'Animation anhalten',
    play: 'Animation abspielen',
    platform: 'openagentix',
    control: 'Kontroll-Agent',
    controlHint: 'Budget · Rate · Datenklasse · Anomalien',
    gate: 'Audit-Gate',
    tools: 'MCP-Tools',
    audit: 'Audit-Trail',
    auditHint: 'SHA-256-Hashkette',
    agent: 'Agent',
    allowed: 'erlaubt',
    blocked: 'blockiert',
    events: 'Ereignisse',
    results: 'Ergebnisse',
    sources: {
      kafka: 'Kafka',
      webhook: 'Webhook',
      stream: 'Stream',
      mail: 'E-Mail',
      teams: 'MS Teams',
      cron: 'Cron',
    },
    sourceHints: {
      kafka: 'orders.failed',
      webhook: 'Jira · GitHub',
      stream: 'Log-Stream',
      mail: 'rechnungen@',
      teams: '@agentix',
      cron: 'nachts 03:00',
    },
    outputs: {
      pr: 'Pull Request',
      cve: 'CVE behoben',
      ticket: 'Jira aktualisiert',
      message: 'Slack / Teams',
      report: 'Bericht',
      metrics: 'Metriken',
    },
    outputHints: {
      pr: '+12 −3 Zeilen',
      cve: 'kritisch → 0',
      ticket: 'OPS-482',
      message: '#ops-alerts',
      report: 'Markdown · PDF',
      metrics: 'Prometheus',
    },
    scenarios: {
      cve: {
        caption: 'Nächtlicher Zeitplan: Container-Images scannen, die verwundbare Abhängigkeit aktualisieren, Pull Request öffnen.',
        agents: { triage: 'CVE-Triage', fixer: 'Paket-Updater' },
      },
      ticket: {
        caption: 'Jira-Webhook: Ticket einordnen, Runbook prüfen, Ticket aktualisieren.',
        agents: { classifier: 'Einordnung', checker: 'Runbook-Prüfung', updater: 'Ticket-Pflege' },
      },
      orders: {
        caption: 'Kafka-Nachricht: fehlgeschlagene Bestellungen nur lesend untersuchen, dann Bericht und Chat-Zusammenfassung senden.',
        agents: { investigator: 'Ermittler', reporter: 'Berichterstatter' },
      },
      invoice: {
        caption: 'E-Mail: Ein Agent versucht eine Überweisung, die nicht auf seiner Allowlist steht. Blockiert, protokolliert, Freigabe angefragt.',
        agents: { reader: 'Rechnungsleser', payer: 'Zahlungsagent' },
      },
      incident: {
        caption: 'Erwähnung in Teams: Incident-Logs analysieren, Zusammenfassung posten, Metriken exportieren.',
        agents: { analyst: 'Log-Analyse', summariser: 'Zusammenfassung' },
      },
      anomaly: {
        caption: 'Log-Stream: Auffälligkeiten erkennen, Metriken melden, kurzen Bericht schreiben.',
        agents: { watcher: 'Anomalie-Wächter' },
      },
    },
  },
  story: {
    eyebrow: 'So funktioniert’s',
    title: 'Vom Ereignis zum Ergebnis – Schritt für Schritt abgesichert.',
    progress: 'Schritt {current} von {total}',
    steps: [
      {
        label: 'Ereignis',
        title: 'Ein Ereignis trifft ein.',
        body: 'Ein signierter Webhook, ein Kafka-Topic, ein Zeitplan, eine E-Mail oder eine Erwähnung im Chat. openagentix prüft es, speichert es und startet einen Lauf.',
      },
      {
        label: 'Audit-Gate',
        title: 'Jeder Tool-Aufruf wird vorher geprüft.',
        body: 'Bevor ein Agent ein Tool nutzt, gleicht sein Audit-Gate den Aufruf mit Allowlist und Argumentregeln ab. Deterministischer Code, kein Modell. Passt der Aufruf nicht, wird er nicht ausgeführt.',
      },
      {
        label: 'Agenten',
        title: 'Agenten reichen die Arbeit weiter.',
        body: 'Ein einzelner Agent oder eine Pipeline aus mehreren, beschrieben in einer versionierten agents.md. Jeder bekommt nur die Tools und Daten, die er braucht.',
      },
      {
        label: 'Kontroll-Agent',
        title: 'Ein Kontroll-Agent behält jeden Lauf im Blick.',
        body: 'Budgets, Raten, Datenklassen und verbotene Aktionen gelten über alle Läufe hinweg. Er kann Läufe anhalten oder beenden. Eine optionale Prüfung durch ein Modell kann Regeln nur verschärfen, nie lockern.',
      },
      {
        label: 'Ergebnisse',
        title: 'Ergebnisse landen dort, wo Ihr Team arbeitet.',
        body: 'Ein Pull Request, eine behobene CVE, ein aktualisiertes Ticket, eine Nachricht in Teams oder Slack, ein Bericht oder Metriken für Ihr Monitoring. Jedes Ergebnis lässt sich bis zum auslösenden Ereignis zurückverfolgen.',
      },
    ],
  },
  problem: {
    eyebrow: 'Warum openagentix',
    title: 'Agenten sind schnell vorgeführt – und schwer zu betreiben.',
    problemsLabel: 'Das Problem',
    solutionsLabel: 'Die Antwort',
    problems: [
      {
        title: 'Blackbox',
        body: 'Wer hat dem Agenten erlaubt, diese API aufzurufen, und mit welchen Daten? Die meisten Setups können es nicht sagen.',
      },
      {
        title: 'Ausufernde Kosten',
        body: 'Eine Schleife oder ein geschwätziger Prompt verbrennt still das Budget, bis die Rechnung kommt.',
      },
      {
        title: 'Überall Klebstoff',
        body: 'Jedes Team baut eigene Trigger, Secrets und Skripte. Nichts wird wiederverwendet, nichts geprüft.',
      },
    ],
    solutionTitle: 'Eine Plattform mit eingebauten Leitplanken.',
    solutions: [
      {
        title: 'Erst prüfen, dann handeln',
        body: 'Allowlists und Argumentregeln werden vor jedem Tool-Aufruf im Code geprüft.',
      },
      {
        title: 'Kosten bei jedem Schritt',
        body: 'Tokens, Preise und Tool-Aufrufe pro Schritt – mit Budgets, die einen Lauf stoppen, statt nur zu warnen.',
      },
      {
        title: 'Gemeinsame Bausteine',
        body: 'Ereignisse, Verbindungen und Agenten werden einmal beschrieben, versioniert und teamübergreifend genutzt.',
      },
    ],
  },
  architecture: {
    eyebrow: 'Architektur',
    title: 'Ein Kontrollknoten, der entscheidet. Worker, die nur ausführen.',
    lead: 'Der Kontrollknoten hält Registry, Policy-Gates, Audit-Kette, Kosten und Metriken – und führt selbst nie ein Tool aus. Gearbeitet wird in kurzlebigen Worker-Knoten, die genau die Tools mitbringen, die ein Agent braucht.',
    steps: [
      {
        label: 'Kontrollknoten',
        title: 'Der Kontrollknoten plant den Lauf.',
        body: 'Er lädt die Agentenversion aus der Registry, prüft das Budget und stellt ein kurzlebiges, signiertes Lauf-Token aus. Ausgeführt wird hier nichts.',
      },
      {
        label: 'Start',
        title: 'Ein Worker startet – mit genau den nötigen Tools.',
        body: 'Der Runner startet das Toolbox-Image des Agenten, etwa git + node, trivy oder jira-cli. Minimal, ohne root, schreibgeschützt, per Digest fixiert, signiert und gescannt. Ausgehender Verkehr nur per Allowlist.',
      },
      {
        label: 'Erst fragen',
        title: 'Vor jedem Tool-Aufruf fragt der Worker nach.',
        body: 'Jeder Aufruf geht zuerst an das Policy-Gate des Kontrollknotens. Die Schritte fließen über einen authentifizierten Kanal zurück und landen in der Audit-Kette.',
      },
      {
        label: 'Abbau',
        title: 'Danach ist der Worker weg.',
        body: 'Endet der Lauf, wird der Worker entfernt und seine eingegrenzten Secrets werden widerrufen. Nichts bleibt liegen, nichts driftet.',
      },
    ],
    controlNode: 'Kontrollknoten',
    controlParts: ['Registry', 'Policy-Gates', 'Audit-Kette', 'Kosten', 'Metriken'],
    neverExecutes: 'führt nie Tools aus',
    worker: 'Worker-Knoten',
    toolbox: 'Toolbox-Image',
    signed: 'signiert',
    scanned: 'gescannt',
    sbom: 'SBOM',
    egress: 'Ausgang per Allowlist',
    runToken: 'signiertes Lauf-Token',
    policyCheck: 'Policy-Prüfung',
    stepsBack: 'Schritte zurückgemeldet',
    removed: 'entfernt · Secrets widerrufen',
    runnersNote: 'Heute laufen Worker im Prozess oder lokal. Als Nächstes folgen Container und Kubernetes/EKS, danach AWS Lambda und CI-Runner.',
  },
  reveal: {
    eyebrow: 'Die Konsole',
    title: 'Jeden Lauf sehen, Schritt für Schritt.',
    lead: 'Läufe, Schritte, Entscheidungen, Kosten und Audit-Einträge an einem Ort, live während sie passieren.',
    mockLabel: 'Darstellung der openagentix-Konsole mit einem Lauf, seinen Schritten, dem Audit-Status und den Kosten',
    nav: ['Läufe', 'Agenten', 'Ereignisse', 'Verbindungen', 'Audit', 'Kosten'],
    runTitle: 'Lauf #4821 · cve-autofix',
    runMeta: 'Ausgelöst durch Cron · nachts 03:00 · 41 s',
    status: 'Erfolgreich',
    columns: { step: 'Schritt', detail: 'Tool / Modell', decision: 'Gate', cost: 'Kosten' },
    rows: [
      { step: 'Ereignis empfangen', detail: 'cron · nightly', decision: 'geprüft', cost: '–' },
      { step: 'Modellaufruf', detail: 'bedrock · eu-central-1', decision: '–', cost: '0,08 $' },
      { step: 'Tool-Aufruf', detail: 'trivy.scan', decision: 'erlaubt', cost: '0,00 $' },
      { step: 'Modellaufruf', detail: 'bedrock · eu-central-1', decision: '–', cost: '0,11 $' },
      { step: 'Tool-Aufruf', detail: 'github.open_pr', decision: 'erlaubt', cost: '0,00 $' },
      { step: 'Tool-Aufruf', detail: 'github.merge', decision: 'blockiert', cost: '–' },
    ],
    side: {
      audit: 'Audit-Kette',
      auditValue: 'Geprüft · 1.204 Einträge',
      budget: 'Budget',
      budgetValue: '0,42 $ von 5,00 $',
      tokens: 'Tokens',
      tokensValue: '18.240 rein · 2.115 raus',
      approvals: 'Freigaben',
      approvalsValue: 'Merge braucht einen Menschen',
    },
  },
  personas: {
    eyebrow: 'Für das ganze Team',
    title: 'Vier Perspektiven, eine gemeinsame Wahrheit.',
    items: [
      {
        role: 'Fachanwender',
        title: 'Beschreibt den Ablauf',
        body: '„Wenn ein Jira-Ticket mit dem Label payment eingeht, prüfe das Runbook und aktualisiere dann das Ticket.“ Im Dialog, in ganz normaler Sprache.',
      },
      {
        role: 'Integrator',
        title: 'Stellt die Schnittstellen bereit',
        body: 'Bindet MCP-Server, APIs und Ereignisquellen an. Zugangsdaten bleiben im Secret-Store und werden nur per Name referenziert, nie in Prompts kopiert.',
      },
      {
        role: 'Agent-Engineer',
        title: 'Baut zusammen und liefert aus',
        body: 'Macht aus der Beschreibung eine versionierte agents.md mit Tools, Budgets, Freigaben und Tests und bringt sie in Produktion.',
      },
      {
        role: 'Auditor',
        title: 'Prüft anhand von Belegen',
        body: 'Liest den fälschungssicheren Audit-Trail, Kosten und Richtlinien und kann die Hashkette selbst verifizieren.',
      },
    ],
  },
  features: {
    eyebrow: 'Funktionen',
    title: 'Alles, was ein Agent in Produktion braucht.',
    items: {
      events: {
        title: 'Ereignisse rein',
        body: 'Signierte Webhooks, Kafka, Cron, E-Mail, Teams und Slack starten Läufe. Jedes Ereignis wird geprüft und als CloudEvent lückenlos nachverfolgt.',
      },
      mcp: {
        title: 'Eigene MCP-Server mitbringen',
        body: 'Registrieren Sie Ihre MCP-Server je Mandant, remote oder als Container. Jeder Agent bekommt eigene Tool-Allowlists und Argumentregeln, im Code durchgesetzt.',
      },
      rbac: {
        title: 'Mandanten und Zugriff pro Agent',
        body: 'Mandanten trennen Agenten, Läufe, Schlüssel, Audit und Kosten. Rollen gibt es je Mandant und auf Wunsch je Agent, sodass Menschen nur die Agenten sehen, an denen sie arbeiten. OIDC und LDAP/AD sind optional; eine Person kann alle Rollen innehaben.',
      },
      audit: {
        title: 'Revisionssicheres Audit',
        body: 'Nur anhängend, per SHA-256 verkettet, mit signierten Checkpoints. Ein Prüfbefehl deckt Manipulationen auf.',
      },
      costs: {
        title: 'Kosten pro Agent, Anwendungsfall und Lauf',
        body: 'Jede Kostenzeile trägt Mandant, Agent, Anwendungsfall, Lauf, Schritt, Modell und Provider. Nach jedem davon auswerten, als CSV oder JSON exportieren und Läufe mit harten Budgets stoppen.',
      },
      runs: {
        title: 'Konfigurierbare Läufe',
        body: 'Schritte, Timeouts, Freigaben und Datenklassen pro Agent, versioniert in der agents.md.',
      },
      metrics: {
        title: 'Metriken und Traces',
        body: 'Prometheus-Metriken, OpenTelemetry-Traces und JSON-Logs, alles über die Lauf-ID verknüpft.',
      },
      providers: {
        title: 'Eigene Schlüssel und Modelle',
        body: 'OpenAI-kompatible APIs, Ollama, Anthropic und AWS Bedrock. Schlüssel sind Referenzen, begrenzt auf Plattform, Mandant, Team oder Agent. Modelllisten und Preise stammen aus einem festgeschriebenen models.dev-Stand, mit lokalen Anpassungen für private Modelle.',
      },
      helm: {
        title: 'Helm und EKS',
        body: 'Ein Helm-Chart mit IRSA, NetworkPolicies, PodSecurity „restricted“, Autoscaling und Migrations-Job.',
      },
      approvals: {
        title: 'Mensch in der Schleife',
        body: 'Heikle Tools als freigabepflichtig markieren. Der Lauf wartet, bis jemand entscheidet.',
      },
      secrets: {
        title: 'Secrets nur per Referenz',
        body: 'Verbindungen verweisen auf Umgebungsvariablen oder Kubernetes-Secrets. Werte werden in Logs und Audit-Einträgen geschwärzt.',
      },
      offline: {
        title: 'Air-gapped-Betrieb',
        body: 'Keine nachgeladenen Prompts, Skills oder Telemetrie und keine Modellliste, die zur Laufzeit geholt wird. Mit lokalen Modellen und eigenen MCP-Servern muss nichts Ihr Netz verlassen.',
      },
      changeGate: {
        title: 'Zeitpläne mit Änderungsprüfung',
        body: 'Ein Zeitplan kann zuerst prüfen, mit schlichtem Code und ohne Modell: ein Hash von Seite, Datei, API-Antwort oder Abfrage. Der Lauf startet nur, wenn sich etwas geändert hat, ruhige Nächte kosten nichts.',
      },
      guidelines: {
        title: 'Richtlinien und Hardening-Agent',
        body: 'Versionierte Entwicklungsrichtlinien hängen an einem Agenten oder Mandanten. Ein globaler Hardening-Agent prüft, was Entwicklungs-Agenten liefern, gegen unternehmensweite Regeln und kann Entscheidungen nur verschärfen.',
      },
      factory: {
        title: 'Dark Software Factory',
        body: 'Optional: Agenten führen eine Aufgabe von der Spezifikation bis zu Code, Tests und Pull Request mit minimalem menschlichem Eingriff. Nur für MVP- und Proof-of-Concept-Entwicklung empfohlen, nicht für Produktionsänderungen ohne Prüfung.',
      },
    },
  },
  runners: {
    eyebrow: 'Runner',
    title: 'Agenten laufen überall.',
    lead: 'Im Prozess, auf dem Laptop, in Containern, auf Kubernetes oder EKS, in AWS Lambda, GitHub Actions oder GitLab CI. Auf Wunsch mit Ihrem Lieblings-Harness. Immer durch dasselbe Policy-Gate.',
    gate: 'Dasselbe Policy-Gate · dieselbe Audit-Kette · dieselben Budgets',
    items: {
      inProcess: { name: 'Im Prozess', body: 'Der Standard. Läuft direkt im Worker, ohne zusätzliche Komponenten.' },
      local: { name: 'Lokale CLI', body: 'oax run agents.md --event event.json auf dem eigenen Rechner.' },
      container: {
        name: 'Container',
        body: 'Docker oder Podman: ein kurzlebiger Container pro Lauf, schreibgeschützt, ausgehender Verkehr nur per Allowlist.',
      },
      kubernetes: {
        name: 'Kubernetes / EKS',
        body: 'Ein Job pro Lauf mit eigenem ServiceAccount, IRSA und NetworkPolicy.',
      },
      lambda: { name: 'AWS Lambda', body: 'Eine Funktion pro Agentenversion, im eigenen VPC für Bedrock-Endpunkte.' },
      github: {
        name: 'GitHub Actions',
        body: 'workflow_dispatch in einem Ziel-Repository; Ergebnisse kommen über einen signierten Callback zurück.',
      },
      gitlab: { name: 'GitLab CI', body: 'Ein Pipeline-Trigger-Token und derselbe signierte Callback.' },
    },
    harness: {
      title: 'Eigenes Harness mitbringen. Optional.',
      body: 'Claude Code, OpenCode, Hermes oder OpenClaw können einen Agenten ausführen. Ein Adapter übersetzt die agents.md in die Konfiguration des Harness und leitet jeden Tool-Aufruf durch das Policy-Gate von openagentix. Audit, Kontroll-Agent und Kosten bleiben dadurch identisch. Die Plattform funktioniert vollständig ohne Harness.',
    },
  },
  trust: {
    eyebrow: 'Vertrauen im Unternehmen',
    title: 'Belege statt Versprechen.',
    audit: {
      title: 'Fälschungssicherer Audit-Trail',
      body: 'Jeder Eintrag enthält den SHA-256 des vorherigen. Ändert sich auch nur ein Byte, schlägt die Prüfung ab dieser Stelle fehl.',
      verified: 'Kette geprüft',
      checkpoint: 'Signierter Checkpoint · Ed25519',
    },
    rbac: {
      title: 'Rollen, die zu Ihrer Organisation passen',
      body: 'Berechtigungen pro Ressource, je Mandant und auf Wunsch je Agent eingegrenzt. Jede API-Route nennt die nötige Berechtigung, und Tests setzen sie durch.',
      role: 'Rolle',
      legend: { manage: 'verwalten', read: 'lesen', none: 'kein Zugriff' },
    },
    costs: {
      title: 'Kosten, die sich erklären lassen',
      body: 'Pro Lauf, Schritt, Agent, Anwendungsfall und Mandant. Budgets stoppen einen Lauf, bevor er zu teuer wird.',
      budget: 'Monatsbudget',
      of: 'von',
    },
  },
  useCases: {
    eyebrow: 'Einsatzbeispiele',
    title: 'Vom Konzern bis zum Homelab.',
    lead: 'Eine Person auf einem einzelnen Server kann alle Rollen innehaben. Ein Unternehmen ergänzt Mandanten, Single Sign-on und signierte Checkpoints. Der Kern bleibt derselbe.',
    enterprise: {
      title: 'Unternehmen',
      items: [
        {
          title: 'Ticket-Triage',
          body: 'Eingehende Jira-Tickets einordnen, Runbooks prüfen, Felder pflegen und an das richtige Team weiterleiten.',
        },
        {
          title: 'Schwachstellen beheben',
          body: 'CVEs über Hunderte Images hinweg bewerten und Fix-Pull-Requests öffnen – mit Freigabe vor dem Merge.',
        },
        {
          title: 'Incident-Zusammenfassungen',
          body: 'Bei einer Erwähnung in Teams Logs und Metriken sammeln und eine Zeitleiste posten, auf die sich die Rufbereitschaft verlassen kann.',
        },
        {
          title: 'Compliance-Nachweise',
          body: 'Nachweise für Audits nach Zeitplan sammeln und als Bericht ablegen, der sich bis zu den Quellen zurückverfolgen lässt.',
        },
      ],
    },
    small: {
      title: 'Kleine Teams und Homelabs',
      items: [
        {
          title: 'CVE-Triage für Container-Images',
          body: 'Images jede Nacht scannen und eine kurze, priorisierte Liste bekommen statt dreihundert Funde.',
        },
        {
          title: 'Log-Anomalien zusammengefasst',
          body: 'Was in den letzten sechs Stunden auffällig war, kompakt in Ihrem Chat.',
        },
        {
          title: 'Reparatur per Pull Request',
          body: 'Kleine Korrekturen als Pull Request: Abhängigkeits-Updates, Konfigurationsdrift, fehlschlagende Health-Checks.',
        },
        {
          title: 'Vom Postfach zur Aufgabe',
          body: 'E-Mails wie Rechnungen oder Alarme werden zu Tickets – jeder Zahlungsschritt wartet auf Freigabe.',
        },
      ],
    },
  },
  builtBy: {
    eyebrow: 'Von einem Agenten gebaut',
    title: 'Diese Plattform baut ein Agent.',
    body: 'agentix-zero schreibt Code, Tests und Dokumentation von open-agentix. Jede Änderung passiert dieselbe Art von Prüfungen, die die Plattform für Ihre Agenten durchsetzt – und nichts wird ohne menschliche Prüfung veröffentlicht.',
    gatesLabel: 'Prüfungen für jeden Commit',
    gates: ['Conventional Commit', 'Tests · Abdeckung ≥ 80 %', 'Keine Anfragen an Dritte', 'Menschliche Prüfung'],
    passed: 'bestanden',
    feedLabel: 'Letzte Commits von agentix-zero',
  },
  openSource: {
    eyebrow: 'Open Source',
    title: 'Apache-2.0. Selbst gehostet. Ihres.',
    lead: 'Code lesen, auf eigener Hardware betreiben, erweitern. Audit, RBAC und Kostenkontrolle gehören zum Open-Source-Kern.',
    repos: {
      platform: 'API, Worker, Konsole, Policy-Engine, Audit-Kette und Provider.',
      helm: 'Helm-Chart für Kubernetes und EKS mit sicheren Voreinstellungen.',
      website: 'Diese Website und die Dokumentation.',
    },
    contribute: 'Beiträge willkommen: DCO-Sign-off, Conventional Commits, kleine, gut prüfbare Änderungen.',
    roadmapTitle: 'Roadmap',
    roadmapLink: 'Zur vollständigen Roadmap',
    roadmap: [
      {
        phase: '0.1 · Kern',
        body: 'Ereignisse, agents.md, Audit-Gate, Kontroll-Agent, verkettetes Audit, Kosten, Mandanten, Runner im Prozess und lokal.',
      },
      {
        phase: '0.2',
        body: 'Worker-Knoten in Containern und auf Kubernetes/EKS, mit signierten, gescannten Toolbox-Images.',
      },
      {
        phase: '0.3',
        body: 'Runner für AWS Lambda, GitHub Actions und GitLab CI; optionale externe Harnesses.',
      },
      { phase: '1.0', body: 'Stabile APIs, signierte Releases, dokumentierte Upgrades und eine öffentliche Demo.' },
    ],
  },
  cta: {
    title: 'Fangen Sie mit einem Ereignis an.',
    lead: 'openagentix mit Docker Compose starten, einen Webhook verbinden und zusehen, wie der erste Lauf im Protokoll landet.',
    primary: 'Loslegen',
    secondary: 'Auf GitHub folgen',
    demo: 'Live-Demo bald verfügbar',
  },
};
