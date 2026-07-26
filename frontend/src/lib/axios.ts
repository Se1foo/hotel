import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * The access token is held in memory only — deliberately not in localStorage,
 * where any XSS could read it. It is re-obtained from the HTTP-only refresh
 * cookie on page load.
 */
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Required for the HTTP-only refresh cookie.
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

/* -------------------------------------------------------------------------- */
/* Single-flight token refresh                                                */
/* -------------------------------------------------------------------------- */

/** Requests that arrived while a refresh was already in progress. */
type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let queue: QueuedRequest[] = [];

const flushQueue = (error: unknown, token: string | null) => {
  queue.forEach(({ resolve, reject }) => (token ? resolve(token) : reject(error)));
  queue = [];
};

/** Endpoints where a 401 is the answer, not a signal to refresh. */
const NO_REFRESH_PATHS = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/google'];

/** Axios doesn't type custom config flags, so this marks a retried request. */
interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      NO_REFRESH_PATHS.some((path) => originalRequest.url?.startsWith(path))
    ) {
      return Promise.reject(error);
    }

    // Queue behind an in-flight refresh instead of firing a second one.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Uses a bare axios call so this interceptor can't recurse into itself.
      const { data } = await axios.post<{ accessToken: string }>(
        '/api/auth/refresh',
        {},
        { withCredentials: true },
      );

      setAccessToken(data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      flushQueue(null, data.accessToken);

      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      setAccessToken(null);
      // Tells AuthProvider to drop the local session.
      window.dispatchEvent(new Event('auth-logout'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
