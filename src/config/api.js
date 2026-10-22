// Single source of truth for the backend URL used by both the customer site
// and the admin dashboard. Configure with VITE_API_URL (see .env.example).
const DEFAULT_API_URL = 'http://localhost:5001/api';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');

// Origin of the API server (without the trailing /api), used for /uploads/* images.
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
