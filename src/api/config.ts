// In development, Vite proxy will forward /api to https://beautibaza.duckdns.org
// In production, we use the full URL
export const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? ''
    : 'https://beautibaza.duckdns.org';
