export const pages = {
  demo: {
    title: 'Live demo',
    metaTitle: 'Live demo – openagentix',
    description: 'A public openagentix demo with fake data and a simulated model: start a fixed scenario, watch the run and verify the audit chain.',
    eyebrow: 'Live demo',
    heading: 'Try the live demo: start a scenario and follow the run.',
    lead: 'The public demo is a running openagentix instance with a guided tour. Start a fixed scenario, watch agents work, gates decide and the audit trail grow. It uses fake data and the simulated model: no model costs, no outbound calls. The API is read-only and visitors cannot send free text.',
    stepsTitle: 'How it works',
    steps: [
      { title: 'Start a scenario', body: 'Sign in with the shared demo account shown on the sign-in page and pick one of the fixed CVE-triage scenarios.' },
      { title: 'Watch the run', body: 'Follow each step live: model calls, tool calls, gate decisions and costs.' },
      { title: 'Check the chain', body: 'Open the audit view and see the hash chain verify.' },
    ],
    open: 'Open the live demo',
    note: 'The demo shows the current development state and may be reset at any time. To try your own agents, run openagentix locally with Docker Compose.',
    cta: 'Run it locally',
  },
};
