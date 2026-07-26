import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Environment schema.
 *
 * The previous version fell back to hardcoded literals for both JWT secrets
 * (`'supersecretaccesskey123!'` / `'supersecretrefreshkey456!'`). Deployed
 * without those variables set, every token in production was signed with a
 * secret published in the repository — anyone could mint a valid access token
 * for any user id. Secrets are now required, with a minimum length, and the
 * process refuses to boot without them in production.
 */
const secret = (name: string) =>
  isProduction
    ? z.string().min(32, `${name} must be set and at least 32 characters in production`)
    : z.string().min(1).default(`dev-only-insecure-${name.toLowerCase()}`);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1).default('mongodb://localhost:27017/hotel'),

  JWT_ACCESS_SECRET: secret('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: secret('JWT_REFRESH_SECRET'),

  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),

  /** Comma-separated list of allowed origins. */
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  /** Public by design, but must not be hardcoded in source. */
  GOOGLE_CLIENT_ID: z.string().optional(),

  /** Seeds reference data only when the collection is empty unless forced. */
  SEED_ON_START: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  SEED_FORCE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map(
    (issue) => `  - ${issue.path.join('.')}: ${issue.message}`,
  );
  console.error(`\nInvalid environment configuration:\n${issues.join('\n')}\n`);
  console.error('See backend/.env.example for the full list of required variables.\n');
  process.exit(1);
}

const raw = parsed.data;

if (!isProduction && (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)) {
  console.warn(
    '[env] JWT secrets are unset - using insecure development defaults. ' +
      'Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET before deploying.',
  );
}

if (isProduction && raw.JWT_ACCESS_SECRET === raw.JWT_REFRESH_SECRET) {
  console.error('\nJWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different.\n');
  process.exit(1);
}

const origins = raw.FRONTEND_URL.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: raw.NODE_ENV,
  isProduction,
  port: raw.PORT,
  mongoUri: raw.MONGODB_URI,
  jwtAccessSecret: raw.JWT_ACCESS_SECRET,
  jwtRefreshSecret: raw.JWT_REFRESH_SECRET,
  accessTokenTtl: raw.ACCESS_TOKEN_TTL,
  refreshTokenTtl: raw.REFRESH_TOKEN_TTL,
  /** Split so a deployment can allow both an apex and a www origin. */
  allowedOrigins: origins,
  /** The first origin, used when building links in outbound email. */
  frontendUrl: origins[0],
  googleClientId: raw.GOOGLE_CLIENT_ID,
  seedOnStart: raw.SEED_ON_START,
  seedForce: raw.SEED_FORCE,
} as const;
