/**
 * Google sign-in configuration.
 *
 * An OAuth client ID is public by design, but it must not be hardcoded — the
 * original source carried a literal fallback ID, so any fork authenticated
 * against someone else's Google project.
 *
 * Removing that fallback exposed a second problem: `@react-oauth/google` throws
 * "Missing required parameter client_id" from inside `useGoogleLogin` when the
 * provider has an empty ID, and because that happens during render it took the
 * whole Login and Sign-up pages down with it. Google auth is therefore treated
 * as an optional feature that is only mounted when actually configured.
 */
export const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();

export const isGoogleAuthEnabled = googleClientId.length > 0;
