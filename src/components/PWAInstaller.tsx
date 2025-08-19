'use client';

import { useEffect } from 'react';

const PWAInstaller = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('🔧 PWA Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('❌ PWA Service Worker registration failed:', error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PWAInstaller;
