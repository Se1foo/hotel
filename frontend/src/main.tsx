import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App';
import { googleClientId, isGoogleAuthEnabled } from './config/auth';

if (!isGoogleAuthEnabled && import.meta.env.DEV) {
  console.info(
    '[auth] VITE_GOOGLE_CLIENT_ID is not set, so "Continue with Google" is hidden. ' +
      'Email and password sign-in works normally. ' +
      'Copy frontend/.env.example to frontend/.env to enable it.',
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root was not found in index.html');

/**
 * `GoogleOAuthProvider` is only mounted when a client ID exists. Mounting it
 * with an empty ID makes Google's SDK throw during render, which crashed the
 * entire sign-in page rather than just disabling one button.
 *
 * Written as an expression rather than a wrapper component so this entry module
 * exports nothing and Fast Refresh stays happy.
 */
const tree = isGoogleAuthEnabled ? (
  <GoogleOAuthProvider clientId={googleClientId}>
    <App />
  </GoogleOAuthProvider>
) : (
  <App />
);

createRoot(rootElement).render(<StrictMode>{tree}</StrictMode>);
