/**
 * Roles and resources as defined in SPEC.md. The matrix condenses the platform's default grants
 * (packages/core/src/rbac.ts): `manage` = any write permission, `read` = read only.
 */
export const roles = ['admin', 'agent-engineer', 'integrator', 'operator', 'auditor', 'viewer'] as const;
export const resources = ['agents', 'runs', 'connections', 'policies', 'audit', 'costs'] as const;
export type Role = (typeof roles)[number];
export type Resource = (typeof resources)[number];
export type Access = 'manage' | 'read' | 'none';

const m = (...values: Access[]) => Object.fromEntries(resources.map((r, i) => [r, values[i]!])) as Record<Resource, Access>;

export const matrix: Record<Role, Record<Resource, Access>> = {
  //                  agents    runs      connections policies audit   costs
  admin: m('manage', 'manage', 'manage', 'manage', 'read', 'read'),
  'agent-engineer': m('manage', 'manage', 'read', 'read', 'none', 'read'),
  integrator: m('read', 'read', 'manage', 'read', 'none', 'read'),
  operator: m('read', 'manage', 'none', 'none', 'none', 'read'),
  auditor: m('read', 'read', 'read', 'read', 'read', 'read'),
  viewer: m('read', 'read', 'none', 'none', 'none', 'read'),
};

/** Nobody can change the audit trail, not even admins: it is append-only by design. */
export function canWrite(role: Role, resource: Resource): boolean {
  return resource !== 'audit' && matrix[role][resource] === 'manage';
}
