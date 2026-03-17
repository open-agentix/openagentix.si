import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { buildChain, GENESIS, sampleAudit, shortHash, verifyChain } from '../../src/lib/audit-chain';
import { canWrite, matrix, resources, roles } from '../../src/lib/rbac';

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

describe('audit chain', () => {
  const chain = buildChain(sampleAudit, sha256);

  it('links every entry to the previous hash', () => {
    expect(chain[0]!.prev).toBe(GENESIS);
    chain.slice(1).forEach((e, i) => expect(e.prev).toBe(chain[i]!.hash));
    expect(chain.every((e) => /^[0-9a-f]{64}$/.test(e.hash))).toBe(true);
  });

  it('verifies an intact chain', () => {
    expect(verifyChain(chain, sha256)).toBe(-1);
  });

  it('detects a changed payload and a broken link', () => {
    const tampered = chain.map((e) => ({ ...e }));
    tampered[2]!.target = 'github.force_push';
    expect(verifyChain(tampered, sha256)).toBe(2);
    const relinked = chain.map((e) => ({ ...e }));
    relinked[3]!.prev = GENESIS;
    expect(verifyChain(relinked, sha256)).toBe(3);
  });

  it('shortens hashes for display', () => {
    expect(shortHash('abcdef0123456789')).toBe('abcdef…6789');
  });
});

describe('rbac matrix', () => {
  it('covers every role and resource', () => {
    for (const role of roles) {
      expect(Object.keys(matrix[role]).sort()).toEqual([...resources].sort());
    }
  });

  it('keeps the audit trail read-only for everyone and readable for auditors', () => {
    for (const role of roles) expect(canWrite(role, 'audit')).toBe(false);
    expect(matrix.auditor.audit).toBe('read');
    expect(roles.every((r) => !canWrite(r, 'audit'))).toBe(true);
  });

  it('gives admins write access and viewers none', () => {
    expect(canWrite('admin', 'agents')).toBe(true);
    expect(resources.some((r) => canWrite('viewer', r))).toBe(false);
    expect(canWrite('integrator', 'connections')).toBe(true);
  });
});
