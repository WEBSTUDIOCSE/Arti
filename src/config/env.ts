// Environment Configuration
// Set this to true for UAT, false for PROD
export const IS_UAT_ENVIRONMENT = false; // Change this to switch environments

// Firebase Configuration Types
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// UAT Environment Configuration
const UAT_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyDr2GEwj5O4AMQF6JCAu0nhNhlezsgxHS8",
  authDomain: "env-uat-cd3c5.firebaseapp.com",
  projectId: "env-uat-cd3c5",
  storageBucket: "env-uat-cd3c5.firebasestorage.app",
  messagingSenderId: "614576728087",
  appId: "1:614576728087:web:6337d07f43cb3674001452",
  measurementId: "G-RMHPEET5ZY"
};

// PROD Environment Configuration
const PROD_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyDr2GEwj5O4AMQF6csedcJCAu0nhNhlezsgxHS8",
  authDomain: "env-prod-cd3c5.firebaseapp.com",
  projectId: "env-prod-cd3c5",
  storageBucket: "env-prod-cd3c5.firebasestorage.app",
  messagingSenderId: "61457672d8087",
  appId: "1:614576728087:wedfsb:6337dd07f43cb3674001452",
  measurementId: "G-RMHPEET5ZdY"
};

// Environment Detection
export const ENVIRONMENT = IS_UAT_ENVIRONMENT ? 'UAT' : 'PROD';

// Get the current Firebase configuration based on environment
export const getFirebaseConfig = (): FirebaseConfig => {
  const config = IS_UAT_ENVIRONMENT ? UAT_CONFIG : PROD_CONFIG;
  
  // Log the current environment to console
  console.log(`🚀 Current Environment: ${ENVIRONMENT}`);
  console.log(`📱 Firebase Project: ${config.projectId}`);
  
  return config;
};

// Export the active configuration
export const firebaseConfig = getFirebaseConfig();

// Additional environment utilities
export const isUAT = () => IS_UAT_ENVIRONMENT;
export const isPROD = () => !IS_UAT_ENVIRONMENT;

// Environment-specific API URLs (if needed)
export const API_BASE_URL = IS_UAT_ENVIRONMENT 
  ? 'https://uat-api.yourdomain.com' 
  : 'https://api.yourdomain.com';

// Environment-specific settings
export const ENV_SETTINGS = {
  environment: ENVIRONMENT,
  isDebug: IS_UAT_ENVIRONMENT,
  logLevel: IS_UAT_ENVIRONMENT ? 'debug' : 'error',
  apiTimeout: IS_UAT_ENVIRONMENT ? 10000 : 5000,
};
