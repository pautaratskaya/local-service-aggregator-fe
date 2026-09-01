// In development, Vite proxy will forward /api to http://62.238.112.250:8080
// In production, we use the full URL
export const API_BASE_URL =
  import.meta.env.MODE === 'development' ? '' : 'http://62.238.112.250:8080';
