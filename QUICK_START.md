## Quick Start Guide for Environment System

This Next.js project uses a simple but powerful environment configuration system that switches between UAT and PROD environments based on a boolean flag.

### 🔧 How to Switch Environments

1. **Open** `src/config/env.ts`
2. **Change** the `IS_UAT_ENVIRONMENT` variable:
   ```typescript
   // For UAT Environment
   export const IS_UAT_ENVIRONMENT = true;
   
   // For PROD Environment  
   export const IS_UAT_ENVIRONMENT = false;
   ```
3. **Save** the file
4. **Restart** your development server or rebuild for production

### 🎯 What You Get

**UAT Environment** (`IS_UAT_ENVIRONMENT = true`):
- Firebase Project: `env-uat-cd3c5`
- Debug logging enabled
- Extended API timeouts (10 seconds)
- Development features active

**PROD Environment** (`IS_UAT_ENVIRONMENT = false`):
- Firebase Project: `env-prod-cd3c5`
- Minimal logging
- Optimized API timeouts (5 seconds)
- Production optimizations

### 📊 Monitoring Your Environment

The current environment is automatically logged to the browser console when:
- The page loads
- Firebase initializes
- API client starts
- Environment hooks are used

Look for messages like:
```
🚀 Current Environment: UAT
📱 Firebase Project: env-uat-cd3c5
```

### 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit http://localhost:3000 to see the environment information displayed on the page.

### 📱 Firebase Configuration

Your Firebase configurations are properly set up for both environments:

**UAT Config:**
- Project ID: `env-uat-cd3c5`
- API Key: `AIzaSyDr2GEwj5O4AMQF6JCAu0nhNhlezsgxHS8`

**PROD Config:**
- Project ID: `env-prod-cd3c5`
- API Key: `AIzaSyDr2GEwj5O4AMQF6csedcJCAu0nhNhlezsgxHS8`

The system automatically uses the correct configuration based on your environment setting.

### ✅ Benefits

- ✅ **No .env files** - Everything in TypeScript
- ✅ **Type-safe** configurations
- ✅ **Visual feedback** - See which environment you're in
- ✅ **Console logging** - Monitor environment switches
- ✅ **Easy switching** - Just change one boolean
- ✅ **Build-time optimization** - No runtime overhead

### 🔍 Troubleshooting

1. **Environment not switching?** 
   - Make sure to save `src/config/env.ts` after changing `IS_UAT_ENVIRONMENT`
   - Restart your development server

2. **Firebase errors?**
   - Verify your Firebase configurations in `src/config/env.ts`
   - Check the browser console for Firebase initialization logs

3. **Want to add new environment variables?**
   - Add them to the `ENV_SETTINGS` object in `src/config/env.ts`
   - Use the same boolean pattern: `IS_UAT_ENVIRONMENT ? uatValue : prodValue`
