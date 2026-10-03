/** Roles and resources as defined in SPEC.md; the matrix illustrates the default permissions. */
export const roles = ['admin', 'agent-engineer', 'integrator', 'operator', 'auditor', 'viewer'] as const;
export const resources = ['agents', 'runs', 'connections', 'policies', 'audit', 'costs'] as const;
export type Role = (typeof roles)[number];
export type Resource = (typeof resources)[number];
export type Access = 'manage' | 'read' | 'none';

const m = (...values: Access[]) => Object.fromEntries(resources.map((r, i) => [r, values[i]!])) as Record<Resource, Access>;

export const matrix: Record<Role, Record<Resource, Access>> = {
  //                  agents    runs      connections policies audit   costs
  admin: m('manage', 'manage', 'manage', 'manage', 'read', 'manage'),
  'agent-engineer': m('manage', 'manage', 'read', 'read', 'none', 'read'),
  integrator: m('read', 'read', 'manage', 'none', 'none', 'none'),
  operator: m('read', 'manage', 'read', 'read', 'none', 'read'),
  auditor: m('read', 'read', 'read', 'read', 'read', 'read'),
  viewer: m('read', 'read', 'none', 'none', 'none', 'none'),
};

/** Nobody can change the audit trail, not even admins: it is append-only by design. */
export function canWrite(role: Role, resource: Resource): boolean {
  return resource !== 'audit' && matrix[role][resource] === 'manage';
}
