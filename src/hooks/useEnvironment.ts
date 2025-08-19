import { useEffect } from 'react';
import { ENVIRONMENT, ENV_SETTINGS, firebaseConfig } from '@/config/env';

// Custom hook for environment management
export const useEnvironment = () => {
  useEffect(() => {
    // Log environment info when the hook is first used
    console.log('🌍 Environment Hook Initialized');
    console.log(`📊 Environment Details:`, ENV_SETTINGS);
  }, []);

  return {
    environment: ENVIRONMENT,
    firebaseConfig,
    settings: ENV_SETTINGS,
    isUAT: ENVIRONMENT === 'UAT',
    isPROD: ENVIRONMENT === 'PROD',
  };
};
