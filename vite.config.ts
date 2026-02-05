import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://aggregator.duckdns.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Remove CORS-related headers to avoid backend CORS issues
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            console.log('Proxying request to:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log(
              'Proxy response:',
              proxyRes.statusCode,
              proxyRes.statusMessage
            );
          });
          proxy.on('error', (err) => {
            console.log('Proxy error:', err);
          });
        },
      },
    },
  },
});
