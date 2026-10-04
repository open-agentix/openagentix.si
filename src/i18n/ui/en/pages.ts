export const pages = {
  demo: {
    title: 'Live demo',
    metaTitle: 'Live demo – openagentix',
    description: 'A public openagentix demo is coming soon: trigger an event by curl or e-mail and watch the run.',
    eyebrow: 'Coming soon',
    heading: 'Live demo coming soon: trigger an event via curl or e-mail.',
    lead: 'Soon you will be able to start a real run against a public demo instance. Send an event, watch agents work, gates decide and the audit trail grow. The demo uses the simulated provider: no model costs, no outbound calls.',
    stepsTitle: 'How it will work',
    steps: [
      { title: 'Send an event', body: 'Post a small JSON payload with curl, or send an e-mail to the demo address.' },
      { title: 'Watch the run', body: 'Follow each step live: model calls, tool calls, gate decisions and costs.' },
      { title: 'Verify the chain', body: 'Download the audit entries and check the hash chain yourself.' },
    ],
    curlLabel: 'Example (not live yet)',
    mail: 'The e-mail address will be announced here when the demo goes live.',
    note: 'Nothing on this page talks to a backend yet. Until then, run openagentix locally with Docker Compose.',
    cta: 'Run it locally',
  },
};
