# Vercel CI/CD Setup Guide

This project uses GitHub Actions for CI/CD with automatic deployments to Vercel.

## Setup Instructions

### 1. Get your Vercel Token

1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Create a new token
3. Copy the token value

### 2. Configure GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secret:
   - Name: `VERCEL_TOKEN`
   - Value: Your Vercel token from step 1

### 3. Environment Configuration

If your app requires environment variables, add them to your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all required environment variables for each environment:
   - Development
   - Preview  
   - Production

### 4. Workflows

This repository includes three workflows:

#### Production Deploy (`main` branch)
- **Trigger**: Push to `main` branch or manual dispatch
- **Environment**: Production
- **URL**: Your production domain

#### UAT Deploy (`uat` branch)  
- **Trigger**: Push to `uat` branch or manual dispatch
- **Environment**: UAT
- **URL**: UAT deployment URL

#### Preview Deploy (Pull Requests)
- **Trigger**: Pull requests to `main` or `uat` branches
- **Environment**: Preview
- **URL**: Unique preview URL for each PR

## Manual Deployment

You can trigger deployments manually:

1. Go to the **Actions** tab in your GitHub repository
2. Select the workflow you want to run
3. Click **Run workflow**

## Deployment Status

- ✅ **Success**: Green checkmark in commit history
- ❌ **Failed**: Red X in commit history
- 🟡 **In Progress**: Yellow dot in commit history

## Troubleshooting

### Common Issues

1. **Build Failed**: Check the build logs in the Actions tab
2. **Deployment Failed**: Verify your `VERCEL_TOKEN` is correct
3. **Environment Variables**: Ensure all required env vars are set in Vercel

### Getting Help

- Check GitHub Actions logs for detailed error messages
- Verify Vercel project settings
- Ensure all dependencies are properly listed in `package.json`

## Project Structure

```
.github/
  workflows/
    uat-deploy.yml       # UAT deployment
    production-deploy.yml # Production deployment  
    preview-deploy.yml   # PR preview deployment
vercel.json             # Vercel configuration
```

## Features

- 🚀 Automatic deployments on push
- 🔍 Preview deployments for pull requests
- 🔒 Security headers configuration
- ⚡ Optimized caching rules
- 📱 PWA support with service worker
- 🔄 Environment-specific builds
