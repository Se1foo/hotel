#!/usr/bin/env node
/**
 * Dependency audit gate.
 *
 * `npm audit --audit-level=high` is all-or-nothing: it cannot distinguish an
 * advisory nobody has looked at from one that has been assessed and knowingly
 * accepted. That leaves two bad options — a permanently red pipeline, or
 * dropping the check entirely.
 *
 * This fails on any high/critical advisory that is NOT in `ALLOWLIST` below, so
 * a newly published advisory still breaks the build, while an accepted one is
 * recorded with a reason and a review date.
 *
 * Usage: node .github/scripts/audit.mjs <package-dir>
 */
import { execFileSync } from 'node:child_process';
import process from 'node:process';

/**
 * Each entry must state why the advisory does not apply, and when that was last
 * checked. Re-review anything older than ~90 days, and delete an entry the
 * moment a non-breaking upgrade exists.
 */
const ALLOWLIST = [
  {
    id: 'GHSA-qwww-vcr4-c8h2',
    package: 'react-router',
    reviewed: '2026-07-25',
    reason:
      'CSRF bypass in React Router RSC mode. This app is a client-only SPA: it ' +
      'uses BrowserRouter with the declarative Routes/Route/Link API and no ' +
      'data router, loaders, actions, RSC or server rendering, so the affected ' +
      'code path is never reached. The only npm-offered fix is a major-version ' +
      'downgrade to 7.11.0, which would be a functional regression for a ' +
      'vulnerability that is not exploitable here.',
  },
];

const BLOCKING = new Set(['high', 'critical']);
const cwd = process.argv[2] ?? '.';

let report;
try {
  // `npm audit` exits non-zero when it finds anything, so capture rather than throw.
  report = execFileSync('npm', ['audit', '--json'], {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
} catch (error) {
  report = error.stdout;
}

if (!report) {
  console.error('audit: npm produced no output');
  process.exit(1);
}

const { vulnerabilities = {} } = JSON.parse(report);
const allowed = new Map(ALLOWLIST.map((entry) => [entry.id, entry]));

const findings = [];
for (const [name, vuln] of Object.entries(vulnerabilities)) {
  if (!BLOCKING.has(vuln.severity)) continue;

  for (const via of vuln.via) {
    // String entries point at another package, not at an advisory of their own.
    if (typeof via !== 'object') continue;
    findings.push({ name, severity: vuln.severity, id: via.source_id ?? via.url?.split('/').pop(), title: via.title });
  }
}

const unreviewed = findings.filter((f) => !allowed.has(f.id));
const accepted = findings.filter((f) => allowed.has(f.id));

console.log(`audit: ${cwd}`);

if (accepted.length > 0) {
  console.log(`\n  accepted (${accepted.length}):`);
  for (const f of accepted) {
    const entry = allowed.get(f.id);
    console.log(`    - ${f.id} ${f.name} (reviewed ${entry.reviewed})`);
  }
}

if (unreviewed.length === 0) {
  console.log(`\n  no unreviewed high/critical advisories\n`);
  process.exit(0);
}

console.error(`\n  UNREVIEWED high/critical advisories (${unreviewed.length}):`);
for (const f of unreviewed) {
  console.error(`    - ${f.id} [${f.severity}] ${f.name}: ${f.title}`);
}
console.error(
  '\n  Fix with `npm audit fix`, or add an entry to ALLOWLIST in' +
    ' .github/scripts/audit.mjs with a reason and review date.\n',
);
process.exit(1);
