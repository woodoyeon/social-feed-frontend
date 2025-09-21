// next.config.js
const runtimeCaching = [
  // 정적 파일(이미지/CSS/폰트/스크립트)
  {
    urlPattern: ({ request }) =>
      ['image', 'style', 'font', 'script'].includes(request.destination),
    handler: 'CacheFirst',
    options: {
      cacheName: 'assets-v1',
      expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 3600 },
    },
  },
  // API 응답
  {
    urlPattern: /\/api\//,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-v1',
      networkTimeoutSeconds: 3,
      expiration: { maxEntries: 100, maxAgeSeconds: 24 * 3600 },
    },
  },
  // 외부 이미지(CDN 포함)
  {
    urlPattern: /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg)/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'remote-images-v1',
      expiration: { maxEntries: 80, maxAgeSeconds: 30 * 24 * 3600 },
    },
  },
];

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching, 
});

module.exports = withPWA({
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    domains: ['picsum.photos'], 
  },
});
