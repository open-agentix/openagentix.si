export const landing = {
  meta: {
    title: 'openagentix – the open-source agent platform you can audit',
    description:
      'Self-hosted agent platform for homelabs and enterprises: events start runs, agents work through MCP tools, and every tool call is policy-checked, audited and cost-tracked. Bring your own keys, models and MCP servers. Apache-2.0.',
  },
  hero: {
    eyebrow: 'Open source · Apache-2.0 · Self-hosted',
    titleA: 'Agents at work.',
    titleB: 'Every step on the record.',
    lead: 'openagentix turns events into finished work. A webhook, a Kafka message, an e-mail or a schedule starts a run. Agents act through MCP tools. Every tool call is checked before it runs, written to a tamper-evident audit trail and priced to the cent.',
    ctaDocs: 'Read the docs',
    ctaGithub: 'View on GitHub',
    ctaDemo: 'Live demo',
    scrollHint: 'Scroll to see how a run flows',
  },
  diagram: {
    title: 'How a run flows through openagentix',
    description:
      'Events from Kafka, webhooks, Kafka log streams, e-mail, Microsoft Teams (through a webhook) and cron enter the platform on the left. Inside, one to three agents pass the work along. Every tool call passes the agent’s audit gate first, a global control agent watches budgets and guardrails, and each step is appended to a hash-chained audit trail. Results leave on the right through the tools an agent is granted, for example as pull requests, updated tickets, chat messages or reports. The result targets shown are illustrative; declared output targets are planned.',
    pause: 'Pause animation',
    play: 'Play animation',
    platform: 'openagentix',
    control: 'Control agent',
    controlHint: 'budget · rate · data class · anomalies',
    gate: 'Audit gate',
    tools: 'MCP tools',
    audit: 'Audit trail',
    auditHint: 'SHA-256 hash chain',
    agent: 'Agent',
    allowed: 'allowed',
    blocked: 'blocked',
    events: 'Events',
    results: 'Results',
    sources: {
      kafka: 'Kafka',
      webhook: 'Webhook',
      stream: 'Kafka stream',
      mail: 'E-mail',
      teams: 'MS Teams (webhook)',
      cron: 'Cron',
    },
    sourceHints: {
      kafka: 'orders.failed',
      webhook: 'Jira · GitHub',
      stream: 'logs topic',
      mail: 'invoices@',
      teams: 'via webhook',
      cron: 'nightly 03:00',
    },
    outputs: {
      pr: 'Pull request',
      cve: 'CVE fixed',
      ticket: 'Jira updated',
      message: 'Slack / Teams',
      report: 'Report',
      metrics: 'Metrics',
    },
    outputHints: {
      pr: '+12 −3 lines',
      cve: 'critical → 0',
      ticket: 'OPS-482',
      message: '#ops-alerts',
      report: 'Markdown',
      metrics: 'Prometheus',
    },
    scenarios: {
      cve: {
        caption: 'Nightly schedule: scan container images, fix the vulnerable dependency, open a pull request.',
        agents: { triage: 'CVE triage', fixer: 'Dependency fixer' },
      },
      ticket: {
        caption: 'Jira webhook: classify the ticket, check the runbook, update the ticket.',
        agents: { classifier: 'Classifier', checker: 'Runbook check', updater: 'Ticket updater' },
      },
      orders: {
        caption: 'Kafka message: investigate failed orders read-only, then send a report and a chat summary.',
        agents: { investigator: 'Investigator', reporter: 'Reporter' },
      },
      invoice: {
        caption: 'E-mail: an agent tries a bank transfer that is not on its allowlist. Blocked, logged, approval requested.',
        agents: { reader: 'Invoice reader', payer: 'Payment agent' },
      },
      incident: {
        caption: 'Teams message via webhook: analyse the incident logs, post a summary, export metrics.',
        agents: { analyst: 'Log analyst', summariser: 'Summariser' },
      },
      anomaly: {
        caption: 'Kafka log stream: spot anomalies, push metrics, write a short report.',
        agents: { watcher: 'Anomaly watcher' },
      },
    },
  },
  story: {
    eyebrow: 'How it works',
    title: 'From event to outcome, one guarded step at a time.',
    progress: 'Step {current} of {total}',
    steps: [
      {
        label: 'Event in',
        title: 'An event arrives.',
        body: 'A signed webhook, a Kafka topic, a schedule or an e-mail. Chat messages arrive through a webhook. openagentix verifies the event, stores it and starts a run.',
      },
      {
        label: 'Audit gate',
        title: 'Every tool call is checked first.',
        body: 'Before an agent touches a tool, its audit gate compares the call with the allowlist and argument rules. Deterministic code, not a model. If the call does not match, it does not run.',
      },
      {
        label: 'Agents',
        title: 'Agents pass the work along.',
        body: 'One agent or a pipeline of several, defined in a versioned agents.md. Each one gets only the tools and data it needs.',
      },
      {
        label: 'Control agent',
        title: 'A control agent watches every run.',
        body: 'Budgets, rates, data classes and forbidden actions apply across all runs. It can pause or stop a run. Its rules are deterministic code today; an optional model second opinion is planned (0.4).',
      },
      {
        label: 'Results out',
        title: 'Results land where your team works.',
        body: 'Agents deliver through the tools they are granted: a pull request, an updated ticket, a chat message or a report. Each one traceable to the event that caused it. Declared output targets are planned.',
      },
    ],
  },
  problem: {
    eyebrow: 'Why openagentix',
    title: 'Agents are easy to demo and hard to run.',
    problemsLabel: 'The problem',
    solutionsLabel: 'The answer',
    problems: [
      {
        title: 'Black boxes',
        body: 'Who allowed the agent to call that API, and with which data? Most setups cannot say.',
      },
      {
        title: 'Runaway costs',
        body: 'A loop or a chatty prompt burns through the budget quietly until the invoice arrives.',
      },
      {
        title: 'Glue everywhere',
        body: 'Every team wires up its own triggers, secrets and scripts. Nothing is reused, nothing is reviewed.',
      },
    ],
    solutionTitle: 'One platform with the guardrails built in.',
    solutions: [
      {
        title: 'Policy before action',
        body: 'Allowlists and argument rules are checked in code before every tool call.',
      },
      {
        title: 'Costs on every step',
        body: 'Tokens, prices and tool calls per step, with budgets that stop a run instead of just warning.',
      },
      {
        title: 'Shared building blocks',
        body: 'Events, connections and agents are declared once, versioned and reused across teams.',
      },
    ],
  },
  architecture: {
    eyebrow: 'Target architecture · roadmap 0.2',
    title: 'A control node that decides. Workers that only do.',
    lead: 'The control node holds the registry, the policy gates, the audit chain, costs and metrics, and never executes a tool itself. By default the worker runs in-process or locally. The spawned, short-lived workers shown here are on main as an opt-in container runner and ship with 0.2; the signed toolbox images are still planned.',
    steps: [
      {
        label: 'Control node',
        title: 'The control node plans the run.',
        body: 'It loads the agent version from the registry, checks the budget and issues a short-lived, signed run token. Nothing is executed here.',
      },
      {
        label: 'Spawn',
        title: 'A worker starts with exactly the tools it needs.',
        body: 'On main, opt-in (OAX_CONTAINER_*), ships with 0.2: the runner starts a hardened container per step, with allowlisted outbound traffic. Toolbox images (git + node, trivy, jira-cli; minimal, signed, scanned, pinned by digest) are still planned.',
      },
      {
        label: 'Ask first',
        title: 'The worker asks before every tool call.',
        body: 'Each call goes to the policy gate first, with the signed run token. Steps are recorded in the audit chain. This holds for the in-process worker and for the opt-in container runner.',
      },
      {
        label: 'Tear down',
        title: 'Then the worker is gone.',
        body: 'On main, opt-in, ships with 0.2: when the step ends, the container is removed and its per-step credentials are revoked by the credential broker.',
      },
    ],
    controlNode: 'Control node',
    controlParts: ['Registry', 'Policy gates', 'Audit chain', 'Costs', 'Metrics'],
    neverExecutes: 'never executes tools',
    worker: 'Worker node · opt-in, 0.2',
    toolbox: 'Toolbox image · planned',
    signed: 'signed',
    scanned: 'scanned',
    sbom: 'SBOM',
    egress: 'egress allowlisted',
    runToken: 'signed run token',
    policyCheck: 'policy check',
    stepsBack: 'steps streamed back',
    removed: 'removed · secrets revoked',
    runnersNote: 'By default workers run in-process or locally. The container runner and credential broker are on main (opt-in, ship with 0.2). A Kubernetes Job runner exists on main as a building block, not yet wired into the platform. AWS Lambda and CI runners come later.',
  },
  reveal: {
    eyebrow: 'The console',
    title: 'See every run, step by step.',
    lead: 'Runs, steps, decisions, costs and audit entries in one place, live as they happen.',
    mockLabel: 'Illustration of the openagentix console showing a run with its steps, audit status and costs',
    nav: ['Runs', 'Agents', 'Events', 'Connections', 'Audit', 'Costs'],
    runTitle: 'Run #4821 · cve-autofix',
    runMeta: 'Triggered by cron · nightly 03:00 · 41 s',
    status: 'Succeeded',
    columns: { step: 'Step', detail: 'Tool / model', decision: 'Gate', cost: 'Cost' },
    rows: [
      { step: 'Event received', detail: 'cron · nightly', decision: 'verified', cost: '–' },
      { step: 'Model call', detail: 'bedrock · eu-central-1', decision: '–', cost: '$0.08' },
      { step: 'Tool call', detail: 'trivy.scan', decision: 'allowed', cost: '$0.00' },
      { step: 'Model call', detail: 'bedrock · eu-central-1', decision: '–', cost: '$0.11' },
      { step: 'Tool call', detail: 'github.open_pr', decision: 'allowed', cost: '$0.00' },
      { step: 'Tool call', detail: 'github.merge', decision: 'blocked', cost: '–' },
    ],
    side: {
      audit: 'Audit chain',
      auditValue: 'Verified · 1,204 entries',
      budget: 'Budget',
      budgetValue: '$0.42 of $5.00',
      tokens: 'Tokens',
      tokensValue: '18,240 in · 2,115 out',
      approvals: 'Approvals',
      approvalsValue: 'Merge needs a human',
    },
  },
  personas: {
    eyebrow: 'Built for the whole team',
    title: 'Four perspectives, one source of truth.',
    items: [
      {
        role: 'Business user',
        title: 'Describes the workflow',
        body: '“When a Jira ticket with the label payment comes in, check the runbook, then update the ticket.” Described in plain language in an Agent Plan; an engineer turns it into steps.',
      },
      {
        role: 'Integrator',
        title: 'Provides the interfaces',
        body: 'Connects MCP servers, APIs and event sources. Credentials stay in your secret store and are referenced by name, never pasted into prompts.',
      },
      {
        role: 'Agent engineer',
        title: 'Assembles and ships',
        body: 'Turns the description into a versioned agents.md with tools, budgets and approvals, test-runs it and publishes an immutable version. Test suites and promotion gates are planned.',
      },
      {
        role: 'Auditor',
        title: 'Reviews with evidence',
        body: 'Reads the tamper-evident audit trail, costs and policies, and can verify the hash chain independently.',
      },
    ],
  },
  features: {
    eyebrow: 'Features',
    title: 'Everything an agent needs to run under control.',
    items: {
      events: {
        title: 'Events in',
        body: 'Signed webhooks, Kafka, cron and e-mail start runs; Teams and Slack today through a webhook, with dedicated adapters planned for 0.3. Every event is verified and becomes a CloudEvent with a full trail.',
      },
      mcp: {
        title: 'Bring your own MCP',
        body: 'Register your MCP servers per tenant, team or agent and group their tools into named read/write profiles (both next release, 0.2); servers run as containers are planned. Every agent gets its own tool allowlist and argument rules, enforced in code.',
      },
      rbac: {
        title: 'Tenants and per-agent access',
        body: 'Tenants isolate agents, runs, keys, audit and costs (next release, 0.2). Roles are granted per tenant and, if you like, per agent, so people only see the agents they work on. OIDC and LDAP/AD are optional; one person can hold every role.',
      },
      audit: {
        title: 'Revision-safe audit',
        body: 'Append-only and SHA-256 hash-chained, with signed checkpoints. A verify command detects tampering.',
      },
      costs: {
        title: 'Cost per agent, use case and run',
        body: 'Every cost line carries tenant, agent, use case, run, step, model and provider. Aggregate by any of them, export as CSV or JSON, and stop runs with hard budgets.',
      },
      runs: {
        title: 'Configurable runs',
        body: 'Steps, timeouts, approvals and data classification per agent, versioned in agents.md.',
      },
      metrics: {
        title: 'Metrics and traces',
        body: 'Prometheus metrics, OpenTelemetry traces and JSON logs, correlated by run ID. Traces have one span per run today; per-step spans are planned.',
      },
      providers: {
        title: 'Bring your own keys and models',
        body: 'OpenAI-compatible APIs (for example Azure OpenAI, OpenRouter, vLLM; not yet verified with real accounts), Ollama, Anthropic and AWS Bedrock. Keys are references. Scoping them to a tenant, team or agent and the model catalog from a pinned models.dev snapshot arrive in the next release (0.2).',
      },
      helm: {
        title: 'Helm and EKS',
        body: 'A Helm chart with IRSA, NetworkPolicies, restricted PodSecurity, autoscaling and a migration job. It renders and lints in CI; an install test follows once the API image is published.',
      },
      approvals: {
        title: 'Human in the loop',
        body: 'Mark sensitive tools as approval-required. The run waits until a person decides.',
      },
      secrets: {
        title: 'Secrets by reference',
        body: 'Connections point to environment variables or Kubernetes Secrets. Values are redacted in logs and audit entries.',
      },
      offline: {
        title: 'Air-gapped mode',
        body: 'No remote prompts, skills or telemetry, and no model list fetched at run time. With local models and your own MCP servers, nothing has to leave your network. A fail-closed switch arrives in the next release (0.2); an external harness still needs its own egress.',
      },
      changeGate: {
        title: 'Change-gated schedules',
        body: 'A schedule can check first, with plain code and no model: a hash of a page or file (API responses and queries are planned). The run only starts when something changed, so quiet nights cost nothing.',
      },
      guidelines: {
        title: 'Guidelines and a hardening agent',
        body: 'Versioned development guidelines attach to an agent or a tenant. A deterministic hardening review can be run on demand; automatic review of pull requests is planned (0.4).',
      },
      factory: {
        title: 'Dark software factory',
        body: 'Opt-in mode with a fixed notice today; a spec, code, tests and pull request template is planned (0.4). Recommended for MVP and proof-of-concept development only. Not for production changes without review.',
      },
      fourEyes: {
        title: 'Four-eyes publishing for agents',
        body: 'Agents are developed as drafts. With a four-eyes policy enabled for a tenant, publishing needs the approval of another person: reviewers see the exact changes to agents.md, comment on single lines, and approve, request changes or reject, much like a pull-request review. An approval is bound to the exact content, so any later edit needs a new approval. Today agents have drafts and immutable published versions, and the author can publish their own draft; review and approval are not built yet.',
      },
      credentialStore: {
        title: 'Credentials like in a CI server, encrypted',
        body: 'Tokens and secrets stored per team or tenant, encrypted with a key per tenant and referenced by name in agents. Runs can use the values, nobody can read them back. Personal tokens are possible for development and stay out of published agents unless the tenant policy explicitly allows it. HashiCorp Vault and AWS Secrets Manager are planned as alternative secret backends. Today secrets come from the operator\'s environment or mounted files; the encrypted store is not built yet.',
      },
    },
  },
  runners: {
    eyebrow: 'Runners',
    title: 'Run agents anywhere.',
    lead: 'In-process or on your own machine today, containers opt-in on main. Kubernetes or EKS, AWS Lambda, GitHub Actions and GitLab CI are on the roadmap. Optionally with your favourite harness. Always through the same policy gate.',
    gate: 'Same policy gate · same audit chain · same budgets',
    items: {
      inProcess: { name: 'In-process', body: 'The default. Runs inside the worker with no extra moving parts.' },
      local: { name: 'Local CLI', body: 'oax run agents.md --event event.json on your own machine.' },
      container: {
        name: 'Containers',
        body: 'On main, opt-in, ships with 0.2: Docker or Podman, one short-lived container per step, read-only, egress allowlisted.',
      },
      kubernetes: {
        name: 'Kubernetes / EKS',
        body: 'Planned: one Job per step with its own ServiceAccount, IRSA and NetworkPolicy. A building block is on main, not yet wired into the platform.',
      },
      lambda: { name: 'AWS Lambda', body: 'One function per agent version, attached to your VPC for Bedrock endpoints.' },
      github: {
        name: 'GitHub Actions',
        body: 'workflow_dispatch in a target repository; results come back through a signed callback.',
      },
      gitlab: { name: 'GitLab CI', body: 'A pipeline trigger token and the same signed callback.' },
    },
    harness: {
      title: 'Bring your harness. Optional.',
      body: 'An adapter translates agents.md into the harness configuration and routes every tool call through the openagentix policy gate, so audit, control agent and costs stay identical. Claude Code is verified with real runs (in-process, 2026-10-04; next release, 0.2). The isolated run-node path through the model proxy is implemented; its real-run verification is pending. The OpenCode adapter is implemented and tested against a fake CLI; real-run verification is pending. Hermes and OpenClaw are planned. The platform works fully without any harness.',
    },
  },
  trust: {
    eyebrow: 'Enterprise trust',
    title: 'Proof, not promises.',
    audit: {
      title: 'Tamper-evident audit trail',
      body: 'Every entry carries the SHA-256 of the entry before it. Change a single byte and verification fails from that point on.',
      verified: 'Chain verified',
      checkpoint: 'Signed checkpoint · Ed25519',
    },
    rbac: {
      title: 'Roles that match your organisation',
      body: 'Permissions per resource, scoped by tenant and optionally by agent. Every API route declares the permission it needs, and tests enforce it.',
      role: 'Role',
      legend: { manage: 'manage', read: 'read', none: 'no access' },
    },
    costs: {
      title: 'Costs you can explain',
      body: 'Per run, step, agent, use case and tenant. Budgets stop a run before it overspends.',
      budget: 'Monthly budget',
      of: 'of',
    },
  },
  useCases: {
    eyebrow: 'Use cases',
    title: 'From the enterprise to the homelab.',
    lead: 'One person on a single server can hold every role. A company adds tenants, single sign-on and signed checkpoints. The core stays the same. The cases below are examples of what you can build; the repository ships cve-triage, ticket-triage, ticket-updater and code-quality-reviewer as runnable examples, more are planned.',
    enterprise: {
      title: 'Enterprise',
      items: [
        {
          title: 'Ticket triage',
          body: 'Classify incoming Jira tickets, check runbooks, update fields and route them to the right team.',
        },
        {
          title: 'Security remediation',
          body: 'Triage CVEs across hundreds of images and open fix pull requests, with an approval before merge.',
        },
        {
          title: 'Incident summaries',
          body: 'Collect logs and metrics on a Teams message (through a webhook relay) and post a timeline the on-call engineer can trust.',
        },
        {
          title: 'Compliance evidence',
          body: 'Gather evidence for audits on a schedule and file a report that can be traced to its sources.',
        },
      ],
    },
    small: {
      title: 'Small teams and homelabs',
      items: [
        {
          title: 'CVE triage for container images',
          body: 'Scan your images every night and get a short, ranked list instead of three hundred findings.',
        },
        {
          title: 'Log anomaly summaries',
          body: 'A digest of what looked unusual in the last six hours, delivered to your chat.',
        },
        {
          title: 'Auto-repair pull requests',
          body: 'Small fixes as pull requests: dependency bumps, configuration drift, failing health checks.',
        },
        {
          title: 'Inbox to tasks',
          body: 'Turn e-mails such as invoices or alerts into tickets, with any payment step held for approval.',
        },
      ],
    },
  },
  builtBy: {
    eyebrow: 'Built by an agent',
    title: 'This platform is built by an agent.',
    body: 'agentix-zero writes the code, tests and documentation of open-agentix. The project’s rule is that every change goes through a pull request with the same kind of gates the platform enforces for your agents, followed by an independent review before merge (a second review agent).',
    gatesLabel: 'Rules for every change',
    gates: ['Conventional Commit', 'Tests · coverage ≥ 80 %', 'No third-party requests', 'Independent review'],
    feedLabel: 'Recent commits by agentix-zero',
  },
  openSource: {
    eyebrow: 'Open source',
    title: 'Apache-2.0. Self-hosted. Yours.',
    lead: 'Read the code, run it on your own hardware, extend it. Audit, RBAC and cost controls are part of the open-source core.',
    repos: {
      platform: 'API, worker, console, policy engine, audit chain and providers.',
      helm: 'Helm chart for Kubernetes and EKS with secure defaults.',
      website: 'This website and the documentation.',
    },
    contribute: 'Contributions welcome: DCO sign-off, Conventional Commits, small reviewable changes.',
    roadmapTitle: 'Roadmap',
    roadmapLink: 'See the full roadmap',
    roadmap: [
      {
        phase: '0.1 · Core',
        body: 'Events, agents.md, audit gate, control agent, hash-chained audit, costs, in-process and local runners.',
      },
      {
        phase: '0.2',
        body: 'On main: tenants, scoped model keys, monthly budgets, air-gapped switch, typed handovers, tool profiles, Agent Check, Claude Code harness. Container workers: opt-in on main. Planned: signed toolbox images.',
      },
      {
        phase: '0.3',
        body: 'AWS Lambda, GitHub Actions and GitLab CI runners; Hermes and OpenClaw harnesses; Slack and Teams adapters.',
      },
      {
        phase: '0.4',
        body: 'Planned: agent lifecycle with Agent Build, evaluations, version approval and four-eyes publishing with review comments; encrypted team and tenant secrets with Vault and AWS Secrets Manager backends.',
      },
      { phase: '1.0', body: 'Stable APIs, signed releases, documented upgrades and a demo on release images.' },
    ],
  },
  cta: {
    title: 'Start with one event.',
    lead: 'Run openagentix with Docker Compose, connect a webhook and watch the first run land on the record.',
    primary: 'Get started',
    secondary: 'Star on GitHub',
    demo: 'Open the live demo',
  },
  closing: {
    line: 'We trust in SI - super intelligence.',
  },
};
