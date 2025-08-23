# Vercel CI/CD Deployment Checklist

## Pre-Deployment Setup

### ✅ GitHub Repository Setup
- [ ] Repository is public or has proper access permissions
- [ ] Code is pushed to the appropriate branch (`main`, `uat`)
- [ ] All dependencies are listed in `package.json`

### ✅ Vercel Account Setup  
- [ ] Vercel account is created and active
- [ ] Vercel CLI token is generated
- [ ] Project is connected to Vercel (if using dashboard)

### ✅ GitHub Secrets Configuration
- [ ] `VERCEL_TOKEN` secret is added to GitHub repository
- [ ] Secret value is correct and active
- [ ] Permissions are set correctly for Actions

### ✅ Environment Variables
- [ ] All required environment variables are identified
- [ ] Environment variables are added to Vercel project settings
- [ ] Variables are configured for all environments (Development, Preview, Production)

## Deployment Files

### ✅ Required Files
- [ ] `.github/workflows/uat-deploy.yml` - UAT deployment workflow
- [ ] `.github/workflows/production-deploy.yml` - Production deployment workflow  
- [ ] `.github/workflows/preview-deploy.yml` - PR preview workflow
- [ ] `vercel.json` - Vercel configuration
- [ ] `deploy.sh` - Manual deployment script (Unix/Linux/Mac)
- [ ] `deploy.ps1` - Manual deployment script (Windows)
- [ ] `status.sh` - Deployment status checker

### ✅ File Permissions
- [ ] `deploy.sh` has execute permissions (`chmod +x deploy.sh`)
- [ ] `status.sh` has execute permissions (`chmod +x status.sh`)

## Testing Workflows

### ✅ UAT Deployment
- [ ] Push to `uat` branch triggers workflow
- [ ] Build completes successfully
- [ ] Deployment succeeds  
- [ ] UAT environment is accessible
- [ ] All features work as expected

### ✅ Production Deployment
- [ ] Push to `main` branch triggers workflow
- [ ] Build completes successfully
- [ ] Deployment succeeds
- [ ] Production environment is accessible
- [ ] All features work as expected

### ✅ Preview Deployment
- [ ] Pull request triggers preview workflow
- [ ] Build completes successfully
- [ ] Preview deployment succeeds
- [ ] Preview URL is commented on PR
- [ ] Preview environment is accessible

## Post-Deployment Verification

### ✅ Application Health
- [ ] Application loads without errors
- [ ] All pages are accessible
- [ ] API endpoints respond correctly
- [ ] Database connections work (if applicable)
- [ ] Authentication flows work (if applicable)

### ✅ Performance
- [ ] Page load times are acceptable
- [ ] Images and assets load correctly
- [ ] Mobile responsiveness works
- [ ] PWA features work (if applicable)

### ✅ SEO & Metadata
- [ ] Meta tags are correct
- [ ] Open Graph tags work
- [ ] Favicon loads correctly
- [ ] Sitemap is accessible (if applicable)

## Troubleshooting Checklist

### ❌ If Build Fails
- [ ] Check GitHub Actions logs for error details
- [ ] Verify all dependencies are installed
- [ ] Check for TypeScript/ESLint errors
- [ ] Ensure environment variables are set correctly

### ❌ If Deployment Fails
- [ ] Verify `VERCEL_TOKEN` is correct and active
- [ ] Check Vercel project settings
- [ ] Ensure build output is correct
- [ ] Verify `vercel.json` configuration

### ❌ If Application Doesn't Work
- [ ] Check browser console for errors
- [ ] Verify environment variables in deployment
- [ ] Check API endpoints and external services
- [ ] Test in different browsers/devices

## Manual Deployment Commands

```bash
# For Unix/Linux/Mac
export VERCEL_TOKEN="your_token_here"
npm run deploy:uat
npm run deploy:production
npm run deploy:preview

# For Windows PowerShell
$env:VERCEL_TOKEN = "your_token_here"
npm run deploy:uat:win
npm run deploy:production:win
npm run deploy:preview:win
```

## Monitoring & Maintenance

### ✅ Regular Checks
- [ ] Monitor deployment success rates
- [ ] Check application performance metrics
- [ ] Review error logs regularly
- [ ] Update dependencies periodically
- [ ] Renew Vercel tokens as needed

### ✅ Security
- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities
- [ ] Review and rotate tokens regularly
- [ ] Ensure proper access controls

## Support Resources

- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment Guide**: https://nextjs.org/docs/deployment
- **Vercel CLI Reference**: https://vercel.com/docs/cli
