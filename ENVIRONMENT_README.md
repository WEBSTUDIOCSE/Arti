# Environment Configuration System

This Next.js project uses a custom environment configuration system that allows switching between UAT and PROD environments using a simple boolean flag.

## 🚀 Quick Start

### Switching Environments

To switch between environments, edit the `IS_UAT_ENVIRONMENT` variable in `src/config/env.ts`:

```typescript
// Set to true for UAT, false for PROD
export const IS_UAT_ENVIRONMENT = true; // Change this line
```

- `true` = UAT Environment
- `false` = PROD Environment

### Environment Configurations

#### UAT Environment
- **Firebase Project ID:** env-uat-cd3c5
- **Auth Domain:** env-uat-cd3c5.firebaseapp.com
- **Debug Mode:** Enabled
- **API Timeout:** 10 seconds

#### PROD Environment
- **Firebase Project ID:** env-prod-cd3c5
- **Auth Domain:** env-prod-cd3c5.firebaseapp.com
- **Debug Mode:** Disabled
- **API Timeout:** 5 seconds

## 📁 File Structure

```
src/
├── config/
│   └── env.ts              # Main environment configuration
├── hooks/
│   └── useEnvironment.ts   # React hook for environment management
├── lib/
│   └── firebase.ts         # Firebase initialization
├── utils/
│   └── apiClient.ts        # Environment-aware API client
└── components/
    └── EnvironmentInfo.tsx # Component showing current environment
```

## 🛠️ Usage Examples

### Using the Environment Hook

```tsx
import { useEnvironment } from '@/hooks/useEnvironment';

export default function MyComponent() {
  const { environment, isUAT, isPROD, firebaseConfig } = useEnvironment();
  
  return (
    <div>
      <h1>Current Environment: {environment}</h1>
      {isUAT && <p>Running in UAT mode</p>}
      {isPROD && <p>Running in PROD mode</p>}
    </div>
  );
}
```

### Using Firebase

```tsx
import { db, auth } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Firebase is automatically configured based on the current environment
const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  // This will use UAT or PROD Firebase based on IS_UAT_ENVIRONMENT
};
```

### Using the API Client

```tsx
import { apiClient } from '@/utils/apiClient';

// API client automatically uses the correct base URL
const fetchUsers = async () => {
  try {
    const users = await apiClient.get('/users');
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};
```

### Direct Environment Access

```tsx
import { 
  ENVIRONMENT, 
  isUAT, 
  isPROD, 
  firebaseConfig,
  ENV_SETTINGS 
} from '@/config/env';

console.log('Current environment:', ENVIRONMENT);
console.log('Is UAT?', isUAT());
console.log('Is PROD?', isPROD());
console.log('Firebase config:', firebaseConfig);
console.log('All settings:', ENV_SETTINGS);
```

## 🔍 Environment Detection

The system automatically logs the current environment when:

1. The page loads (in the browser console)
2. Firebase is initialized
3. API client is created
4. Environment hook is used

## 🎯 Features

- ✅ No `.env` files needed
- ✅ Type-safe configuration
- ✅ Automatic console logging
- ✅ React hooks integration
- ✅ Firebase auto-configuration
- ✅ Environment-aware API client
- ✅ Visual environment indicator
- ✅ Easy switching mechanism

## 🔧 Customization

### Adding New Environment Variables

Edit `src/config/env.ts` to add new environment-specific configurations:

```typescript
// Add to ENV_SETTINGS object
export const ENV_SETTINGS = {
  environment: ENVIRONMENT,
  isDebug: IS_UAT_ENVIRONMENT,
  logLevel: IS_UAT_ENVIRONMENT ? 'debug' : 'error',
  apiTimeout: IS_UAT_ENVIRONMENT ? 10000 : 5000,
  // Add your new settings here
  maxRetries: IS_UAT_ENVIRONMENT ? 3 : 1,
  cacheEnabled: !IS_UAT_ENVIRONMENT,
};
```

### Customizing API URLs

Modify the API_BASE_URL in `src/config/env.ts`:

```typescript
export const API_BASE_URL = IS_UAT_ENVIRONMENT 
  ? 'https://your-uat-api.com' 
  : 'https://your-prod-api.com';
```

## 🚨 Important Notes

1. **Build Time Configuration:** The environment is set at build time, not runtime
2. **Console Logging:** Check browser console for environment confirmation
3. **Firebase Keys:** Ensure your Firebase configurations are correct for each environment
4. **Git Security:** Consider if you want to commit actual Firebase keys to version control

## 🔄 Deployment

For different deployments, create separate build processes:

```bash
# For UAT deployment
# Set IS_UAT_ENVIRONMENT = true, then:
npm run build

# For PROD deployment  
# Set IS_UAT_ENVIRONMENT = false, then:
npm run build
```

## 📝 Development Workflow

1. Set `IS_UAT_ENVIRONMENT = true` for development
2. Test your features in UAT environment
3. Switch to `IS_UAT_ENVIRONMENT = false` for production testing
4. Deploy with appropriate environment setting
