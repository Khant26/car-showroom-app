// Single source of truth for the backend URL used by both the customer site
// and the admin dashboard. Configure with VITE_API_URL (see .env.example).
//
// - Development (`npm run dev`): falls back to the local API on port 5001.
// - Production builds: VITE_API_URL must be set at build time (e.g. in Vercel);
//   without it the app assumes the API is served from the same origin at /api.
const DEV_FALLBACK_API_URL = 'http://localhost:5001/api';

const configured = (import.meta.env.VITE_API_URL || '').trim();

if (!configured && import.meta.env.PROD) {
  console.warn('VITE_API_URL was not set at build time; using same-origin /api.');
}

export const API_BASE_URL = (configured || (import.meta.env.DEV ? DEV_FALLBACK_API_URL : '/api')).replace(/\/+$/, '');

// Origin of the API server (without the trailing /api), used for /uploads/* images.
// Empty string when the API is same-origin, so /uploads/... stays relative.
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
