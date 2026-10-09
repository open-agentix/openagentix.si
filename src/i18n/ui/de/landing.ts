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
    ctaDemo: 'Live-Demo',
    scrollHint: 'Weiterscrollen und einem Lauf folgen',
  },
  diagram: {
    title: 'So läuft ein Lauf durch openagentix',
    description:
      'Ereignisse aus Kafka, Webhooks, Kafka-Log-Streams, E-Mail, Microsoft Teams (über einen Webhook) und Cron kommen links in die Plattform. Darin reichen ein bis drei Agenten die Arbeit weiter. Jeder Tool-Aufruf passiert zuerst das Audit-Gate des Agenten, ein globaler Kontroll-Agent überwacht Budgets und Leitplanken, und jeder Schritt landet in einem per Hash verketteten Audit-Trail. Rechts verlassen die Ergebnisse die Plattform über die Tools, die ein Agent nutzen darf, zum Beispiel als Pull Requests, aktualisierte Tickets, Chat-Nachrichten oder Berichte. Die gezeigten Ergebnisziele sind beispielhaft; deklarierbare Ausgabeziele sind geplant.',
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
      stream: 'Kafka-Stream',
      mail: 'E-Mail',
      teams: 'MS Teams (Webhook)',
      cron: 'Cron',
    },
    sourceHints: {
      kafka: 'orders.failed',
      webhook: 'Jira · GitHub',
      stream: 'Logs-Topic',
      mail: 'rechnungen@',
      teams: 'über Webhook',
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
      report: 'Markdown',
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
        caption: 'Teams-Nachricht per Webhook: Incident-Logs analysieren, Zusammenfassung posten, Metriken exportieren.',
        agents: { analyst: 'Log-Analyse', summariser: 'Zusammenfassung' },
      },
      anomaly: {
        caption: 'Kafka-Log-Stream: Auffälligkeiten erkennen, Metriken melden, kurzen Bericht schreiben.',
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
        body: 'Ein signierter Webhook, ein Kafka-Topic, ein Zeitplan oder eine E-Mail. Chat-Nachrichten kommen über einen Webhook an. openagentix prüft das Ereignis, speichert es und startet einen Lauf.',
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
        body: 'Budgets, Raten, Datenklassen und verbotene Aktionen gelten über alle Läufe hinweg. Er kann Läufe anhalten oder beenden. Seine Regeln sind heute deterministischer Code; eine optionale Zweitmeinung durch ein Modell ist geplant (0.4).',
      },
      {
        label: 'Ergebnisse',
        title: 'Ergebnisse landen dort, wo Ihr Team arbeitet.',
        body: 'Agenten liefern über die Tools, die sie nutzen dürfen: ein Pull Request, ein aktualisiertes Ticket, eine Chat-Nachricht oder ein Bericht. Jedes Ergebnis lässt sich bis zum auslösenden Ereignis zurückverfolgen. Deklarierbare Ausgabeziele sind geplant.',
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
    eyebrow: 'Zielarchitektur · Roadmap 0.2',
    title: 'Ein Kontrollknoten, der entscheidet. Worker, die nur ausführen.',
    lead: 'Der Kontrollknoten hält Registry, Policy-Gates, Audit-Kette, Kosten und Metriken – und führt selbst nie ein Tool aus. Standardmäßig läuft der Worker im Prozess oder lokal. Die hier gezeigten gestarteten, kurzlebigen Worker liegen auf main als optionaler Container-Runner und erscheinen mit 0.2; die signierten Toolbox-Images sind weiterhin geplant.',
    steps: [
      {
        label: 'Kontrollknoten',
        title: 'Der Kontrollknoten plant den Lauf.',
        body: 'Er lädt die Agentenversion aus der Registry, prüft das Budget und stellt ein kurzlebiges, signiertes Lauf-Token aus. Ausgeführt wird hier nichts.',
      },
      {
        label: 'Start',
        title: 'Ein Worker startet – mit genau den nötigen Tools.',
        body: 'Auf main, optional (OAX_CONTAINER_*), erscheint mit 0.2: Der Runner startet pro Schritt einen gehärteten Container, mit Allowlist für ausgehenden Verkehr. Toolbox-Images (git + node, trivy, jira-cli; minimal, signiert, gescannt, per Digest fixiert) sind weiterhin geplant.',
      },
      {
        label: 'Erst fragen',
        title: 'Vor jedem Tool-Aufruf fragt der Worker nach.',
        body: 'Jeder Aufruf geht zuerst mit dem signierten Lauf-Token an das Policy-Gate. Die Schritte landen in der Audit-Kette. Das gilt für den Worker im Prozess und für den optionalen Container-Runner.',
      },
      {
        label: 'Abbau',
        title: 'Danach ist der Worker weg.',
        body: 'Auf main, optional, erscheint mit 0.2: Endet der Schritt, wird der Container entfernt und seine Zugangsdaten pro Schritt werden vom Credential-Broker widerrufen.',
      },
    ],
    controlNode: 'Kontrollknoten',
    controlParts: ['Registry', 'Policy-Gates', 'Audit-Kette', 'Kosten', 'Metriken'],
    neverExecutes: 'führt nie Tools aus',
    worker: 'Worker-Knoten · optional, 0.2',
    toolbox: 'Toolbox-Image · geplant',
    signed: 'signiert',
    scanned: 'gescannt',
    sbom: 'SBOM',
    egress: 'Ausgang per Allowlist',
    runToken: 'signiertes Lauf-Token',
    policyCheck: 'Policy-Prüfung',
    stepsBack: 'Schritte zurückgemeldet',
    removed: 'entfernt · Secrets widerrufen',
    runnersNote: 'Standardmäßig laufen Worker im Prozess oder lokal. Container-Runner und Credential-Broker liegen auf main (optional, erscheinen mit 0.2). Ein Kubernetes-Job-Runner liegt auf main als Baustein vor, noch nicht in die Plattform eingebunden. AWS Lambda und CI-Runner folgen später.',
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
        body: 'Macht aus der Beschreibung eine versionierte agents.md mit Tools, Budgets und Freigaben, testet sie im Probelauf und veröffentlicht eine unveränderliche Version. Testsuiten und Freigabeschranken sind geplant.',
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
    title: 'Alles, was ein Agent für kontrollierten Betrieb braucht.',
    items: {
      events: {
        title: 'Ereignisse rein',
        body: 'Signierte Webhooks, Kafka, Cron und E-Mail starten Läufe; Teams und Slack heute über einen Webhook, eigene Adapter sind für 0.3 geplant. Jedes Ereignis wird geprüft und als CloudEvent lückenlos nachverfolgt.',
      },
      mcp: {
        title: 'Eigene MCP-Server mitbringen',
        body: 'Registrieren Sie Ihre MCP-Server je Mandant, Team oder Agent und fassen Sie ihre Tools in benannten Lese-/Schreibprofilen zusammen (beides nächstes Release, 0.2); als Container laufende Server sind geplant. Jeder Agent bekommt eigene Tool-Allowlists und Argumentregeln, im Code durchgesetzt.',
      },
      rbac: {
        title: 'Mandanten und Zugriff pro Agent',
        body: 'Mandanten trennen Agenten, Läufe, Schlüssel, Audit und Kosten (nächstes Release, 0.2). Rollen gibt es je Mandant und auf Wunsch je Agent, sodass Menschen nur die Agenten sehen, an denen sie arbeiten. OIDC und LDAP/AD sind optional; eine Person kann alle Rollen innehaben.',
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
        body: 'Prometheus-Metriken, OpenTelemetry-Traces und JSON-Logs, über die Lauf-ID verknüpft. Traces haben heute einen Span pro Lauf; Spans pro Schritt sind geplant.',
      },
      providers: {
        title: 'Eigene Schlüssel und Modelle',
        body: 'OpenAI-kompatible APIs, Ollama, Anthropic und AWS Bedrock. Schlüssel sind Referenzen. Ihre Begrenzung auf Mandant, Team oder Agent und der Modellkatalog aus einem festgeschriebenen models.dev-Stand kommen im nächsten Release (0.2).',
      },
      helm: {
        title: 'Helm und EKS',
        body: 'Ein Helm-Chart mit IRSA, NetworkPolicies, PodSecurity „restricted“, Autoscaling und Migrations-Job. Es wird in der CI gerendert und geprüft; ein Installationstest folgt, sobald das API-Image veröffentlicht ist.',
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
        body: 'Keine nachgeladenen Prompts, Skills oder Telemetrie und keine Modellliste, die zur Laufzeit geholt wird. Mit lokalen Modellen und eigenen MCP-Servern muss nichts Ihr Netz verlassen. Ein Fail-closed-Schalter kommt im nächsten Release (0.2); ein externes Harness braucht weiterhin eigenen Netzzugang.',
      },
      changeGate: {
        title: 'Zeitpläne mit Änderungsprüfung',
        body: 'Ein Zeitplan kann zuerst prüfen, mit schlichtem Code und ohne Modell: ein Hash von Seite oder Datei (API-Antworten und Abfragen sind geplant). Der Lauf startet nur, wenn sich etwas geändert hat, ruhige Nächte kosten nichts.',
      },
      guidelines: {
        title: 'Richtlinien und Hardening-Agent',
        body: 'Versionierte Entwicklungsrichtlinien hängen an einem Agenten oder Mandanten. Eine deterministische Hardening-Prüfung lässt sich bei Bedarf ausführen; die automatische Prüfung von Pull Requests ist geplant (0.4).',
      },
      factory: {
        title: 'Dark Software Factory',
        body: 'Optionaler Modus, heute mit festem Hinweis; eine Vorlage für Spezifikation, Code, Tests und Pull Request ist geplant (0.4). Nur für MVP- und Proof-of-Concept-Entwicklung empfohlen, nicht für Produktionsänderungen ohne Prüfung.',
      },
    },
  },
  runners: {
    eyebrow: 'Runner',
    title: 'Agenten laufen überall.',
    lead: 'Heute im Prozess oder auf dem eigenen Rechner, Container optional auf main. Kubernetes oder EKS, AWS Lambda, GitHub Actions und GitLab CI stehen auf der Roadmap. Auf Wunsch mit Ihrem Lieblings-Harness. Immer durch dasselbe Policy-Gate.',
    gate: 'Dasselbe Policy-Gate · dieselbe Audit-Kette · dieselben Budgets',
    items: {
      inProcess: { name: 'Im Prozess', body: 'Der Standard. Läuft direkt im Worker, ohne zusätzliche Komponenten.' },
      local: { name: 'Lokale CLI', body: 'oax run agents.md --event event.json auf dem eigenen Rechner.' },
      container: {
        name: 'Container',
        body: 'Auf main, optional, erscheint mit 0.2: Docker oder Podman, ein kurzlebiger Container pro Schritt, schreibgeschützt, ausgehender Verkehr nur per Allowlist.',
      },
      kubernetes: {
        name: 'Kubernetes / EKS',
        body: 'Geplant: ein Job pro Schritt mit eigenem ServiceAccount, IRSA und NetworkPolicy. Ein Baustein liegt auf main, noch nicht in die Plattform eingebunden.',
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
      body: 'Ein Adapter übersetzt die agents.md in die Konfiguration des Harness und leitet jeden Tool-Aufruf durch das Policy-Gate von openagentix. Audit, Kontroll-Agent und Kosten bleiben dadurch identisch. Claude Code ist mit echten Läufen im Prozess verifiziert (2026-10-04; nächstes Release, 0.2). Der isolierte Run-Node-Pfad über den Model-Proxy ist implementiert; die Prüfung mit echtem Lauf steht aus. Der OpenCode-Adapter ist implementiert und gegen eine Attrappen-CLI getestet; die Prüfung mit echtem Programm steht aus. Hermes und OpenClaw sind geplant. Die Plattform funktioniert vollständig ohne Harness.',
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
    lead: 'Eine Person auf einem einzelnen Server kann alle Rollen innehaben. Ein Unternehmen ergänzt Mandanten, Single Sign-on und signierte Checkpoints. Der Kern bleibt derselbe. Die folgenden Fälle sind Beispiele dafür, was sich bauen lässt; das Repository liefert cve-triage und ticket-updater als lauffähige Beispiele, weitere sind geplant.',
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
          body: 'Bei einer Teams-Nachricht (über ein Webhook-Relay) Logs und Metriken sammeln und eine Zeitleiste posten, auf die sich die Rufbereitschaft verlassen kann.',
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
    body: 'agentix-zero schreibt Code, Tests und Dokumentation von open-agentix. Die Projektregel: Jede Änderung läuft über einen Pull Request mit derselben Art von Prüfungen, die die Plattform für Ihre Agenten durchsetzt, gefolgt von einer menschlichen Prüfung.',
    gatesLabel: 'Regeln für jede Änderung',
    gates: ['Conventional Commit', 'Tests · Abdeckung ≥ 80 %', 'Keine Anfragen an Dritte', 'Menschliche Prüfung'],
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
        body: 'Ereignisse, agents.md, Audit-Gate, Kontroll-Agent, verkettetes Audit, Kosten, Runner im Prozess und lokal.',
      },
      {
        phase: '0.2',
        body: 'Auf main: Mandanten, Modellschlüssel pro Geltungsbereich, Monatsbudgets, Air-Gap-Schalter, typisierte Übergaben, Tool-Profile, Agent Check, Claude-Code-Harness. Container-Worker: optional auf main. Geplant: signierte Toolbox-Images.',
      },
      {
        phase: '0.3',
        body: 'Runner für AWS Lambda, GitHub Actions und GitLab CI; Hermes- und OpenClaw-Harnesses; Slack- und Teams-Adapter.',
      },
      { phase: '1.0', body: 'Stabile APIs, signierte Releases, dokumentierte Upgrades und eine Demo auf Release-Images.' },
    ],
  },
  cta: {
    title: 'Fangen Sie mit einem Ereignis an.',
    lead: 'openagentix mit Docker Compose starten, einen Webhook verbinden und zusehen, wie der erste Lauf im Protokoll landet.',
    primary: 'Loslegen',
    secondary: 'Auf GitHub folgen',
    demo: 'Live-Demo öffnen',
  },
  closing: {
    line: 'Wir vertrauen auf SI - Super Intelligence.',
  },
};
