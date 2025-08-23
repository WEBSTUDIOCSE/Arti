// Firebase initialization with environment-based configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig, ENVIRONMENT } from '@/config/env';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (disabled for now to avoid blocking issues)
export const analytics = null;

// Log Firebase initialization
console.log(`🔥 Firebase initialized for ${ENVIRONMENT} environment`);
console.log(`📊 Project ID: ${firebaseConfig.projectId}`);

export default app;
