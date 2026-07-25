/**
 * Runs before any test module is imported.
 *
 * `config/env.ts` validates on import and calls `process.exit(1)` when required
 * variables are missing, so the secrets must exist before the module graph is
 * loaded. Doing it here lets the tests use ordinary static imports.
 */
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret-long-enough-for-production-rules';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret-long-enough-for-production-rules';
process.env.SEED_ON_START = 'false';
process.env.SEED_FORCE = 'false';
