// ─── Environment Configuration ──────────────────────────────────
// All environment variables must be prefixed with VITE_ to be exposed to the client.
// Create a .env file at the project root to override defaults.

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  appName: import.meta.env.VITE_APP_NAME ?? 'Burgerizza',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
