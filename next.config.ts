import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // This will disable PWA in development
  buildExcludes: [/middleware-manifest\.json$/, /app-build-manifest\.json$/], // Exclude problematic files
  runtimeCaching: [
    {
      urlPattern: /^https?.*/, // Cache all external requests
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      // Exclude service worker from turbopack
      '*.worker.js': ['raw-loader'],
    },
  },
};

export default withPWA(nextConfig);
